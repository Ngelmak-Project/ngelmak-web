import { CommonModule } from '@angular/common';
import { Component, inject, NgZone, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITEMS_PER_PAGE, PAGE_HEADER } from 'app/config/pagination.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { PostDetailComponent } from 'app/entities/nk-post/detail/nk-post-detail.component';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ScrollService } from 'app/shared/services/scroll.service';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: ' app-channel-posts',
  templateUrl: './channel-posts.component.html',
  imports: [CommonModule, RouterModule, PostDetailComponent],
  animations: [fadeInUp400ms],
})
export class ChannelPostsComponent {
  private subs = new Subscription();
  protected channelService = inject(ChannelService);
  protected postService = inject(PostService);
  protected scroll = inject(ScrollService);
  posts = signal<IPostDTO[]>([]);
  isLoading = signal(false);

  sortState = sortStateSignal({});
  hasNext = signal(false);

  private router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected authService = inject(AuthenticationService);
  channel = inject(ChannelService).channel;

  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;
  query = '';

  protected ngZone = inject(NgZone);

  // Track last known scrollHeight to avoid reloading when height doesn't change
  private lastHeight = 0;

  ngOnInit(): void {
    // Listen to scroll end events
    this.subs.add(
      this.scroll.endReached$.subscribe((height) => {
        this.handleScrollEnd(height);
      }),
    );

    // Initial load
    this.subs.add(
      this.activatedRoute.queryParamMap
        .pipe(
          tap((params) => {
            this.query = params.get('q') ?? '';
            const page = params.get(PAGE_HEADER);
            this.page = +(page ?? 1);
          }),
          tap(() => this.loadAll(true)), // reset posts
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // unsubscribes ALL at once
  }

  loadNext(): void {
    this.page++;
    this.loadAll();
  }

  /**
   * Called when scroll reaches the bottom.
   * Loads more only if:
   * - not already loading
   * - there is more data (hasNext)
   * - the scrollHeight increased since last load
   */
  private handleScrollEnd(height: number): void {
    // 1. Avoid duplicate loads while API is busy
    if (this.isLoading()) {
      return;
    }

    // 2. No more pages available
    if (!this.hasNext()) {
      return;
    }

    // 3. Height did not change → nothing new was added → avoid infinite loop
    if (height <= this.lastHeight) {
      return;
    }

    // Update last known height
    this.lastHeight = height;

    // Load next page
    this.loadNext();
  }

  loadAll(reset = false): void {
    this.isLoading.set(true);

    const req = {
      page: this.page - 1,
      size: this.itemsPerPage,
      q: this.query,
    };

    this.postService.findByAuthenticatedUser(req).subscribe({
      next: (res) => {
        const { body } = res;
        this.hasNext.set(body.content.length == this.itemsPerPage);
        if (reset) {
          this.posts.set(body.content ?? []);
        } else {
          this.posts.update((e) => [...e, ...body.content]);
        }
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  search(query: string): void {
    this.handleNavigation(1, query);
  }

  protected handleNavigation(page: number, query?: string): void {
    const queryParamsObj = { q: query, page, size: this.itemsPerPage };

    this.ngZone.run(() => {
      this.router.navigate(['/', query?.length ? 'search' : ''], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}

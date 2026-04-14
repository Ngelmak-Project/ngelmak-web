import { CommonModule } from '@angular/common';
import { Component, inject, input, NgZone, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITEMS_PER_PAGE, PAGE_HEADER } from 'app/config/pagination.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { PostCardComponent } from 'app/entities/nk-post/card/nk-post-card.component';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ScrollService } from 'app/shared/scrool-detection/scroll.service';
import { sortStateSignal } from 'app/shared/sort';
import { Subscription, tap } from 'rxjs';
import { TranslateDirective } from "app/shared/translation/translate.directive";

@Component({
  selector: 'app-channel-feed',
  templateUrl: './channel-feed.component.html',
  imports: [CommonModule, RouterModule, PostCardComponent, TranslateDirective],
  animations: [fadeInUp400ms],
})
export class ChannelFeedComponent {
  channel = input.required<IChannel>();

  protected channelService = inject(ChannelService);
  protected postService = inject(PostService);
  protected activatedRoute = inject(ActivatedRoute);
  protected authService = inject(AuthenticationService);
  protected scroll = inject(ScrollService);
  protected ngZone = inject(NgZone);
  private subs = new Subscription();
  private router = inject(Router);

  posts = signal<IPostDTO[]>([]);

  isLoading = signal(false);
  sortState = sortStateSignal({});
  hasNext = signal(false);
  itemsPerPage = ITEMS_PER_PAGE;
  page = signal(1);
  query = signal('');

  // Track last known scrollHeight to avoid reloading when height doesn't change
  private lastHeight = signal(0);

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
            this.query.set(params.get('q') ?? '');
            const page = params.get(PAGE_HEADER);
            this.page.set(+(page ?? 1));
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
    this.page.update((v) => v + 1);
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
    if (height <= this.lastHeight()) {
      return;
    }

    // Update last known height
    this.lastHeight.set(height);

    // Load next page
    this.loadNext();
  }

  loadAll(reset = false): void {
    this.isLoading.set(true);

    const req = {
      page: this.page() - 1,
      size: this.itemsPerPage,
      q: this.query(),
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

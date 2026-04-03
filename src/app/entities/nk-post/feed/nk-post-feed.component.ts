import { Component, computed, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { finalize, Subscription, tap } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import SharedModule from 'app/shared/shared.module';
import { SortService, sortStateSignal } from 'app/shared/sort';

import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { PostCardComponent } from 'app/entities/nk-post/card/nk-post-card.component';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ScrollService } from 'app/shared/services/scroll.service';

interface IFeedPageDTO {
  content: IPostDTO[];
  sessionKey: string;
  windowStart: Date;
  number: number;
  sorts: string[];
}

@Component({
  standalone: true,
  selector: 'app-post-feed',
  templateUrl: './nk-post-feed.component.html',
  imports: [RouterModule, FormsModule, SharedModule, PostCardComponent, PostUpdateComponent,],
  animations: [fadeInUp400ms],
})
export class PostFeedComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  protected postService = inject(PostService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected authService = inject(AuthenticationService);
  protected scroll = inject(ScrollService);
  protected alertService = inject(AlertService);
  channel = inject(ChannelService).channel;
  protected ngZone = inject(NgZone);

  private subs = new Subscription();

  // Feed content
  feeds = signal<IPostDTO[]>([]);
  hasNext = signal(true);
  isLoading = signal(false);

  // Sorting
  sortState = sortStateSignal({});

  // Internal pagination (NOT visible in URL)
  itemsPerPage = ITEMS_PER_PAGE;
  page = signal(1);
  // Search query (visible in URL)
  query = signal('');
  // Session key for pagination continuity
  sessionKey = signal<string | null>(null);

  // Track last scroll height to avoid infinite loops
  private lastHeight = 0;

  /**
   * Computed boolean: search is allowed only if query length >= 5
   */
  hasMinimumQueryLength = computed(() => !this.isLoading() && this.query().length >= 5);

  ngOnInit(): void {
    // Infinite scroll listener
    this.subs.add(this.scroll.endReached$.subscribe((height) => this.handleScrollEnd(height)));

    /**
     * Read ONLY the search query from the URL.
     * Page & size are now INTERNAL ONLY.
     */
    this.subs.add(
      this.activatedRoute.queryParamMap
        .pipe(
          tap((params) => {
            this.query.set(params.get('q') ?? '');
          }),
          tap(() => {
            // Reset pagination when query changes
            this.page.set(1);
            this.loadAll(true);
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Add newly created post to the top of the feed.
   */
  handlePostSaved(newPost: IPostDTO): void {
    this.feeds.update((list) => [{ id: null, post: newPost }, ...list]);
  }

  /**
   * Load next page internally (NOT in URL)
   */
  loadNext(): void {
    this.page.update((value) => value + 1);
    this.loadAll();
  }

  /**
   * Infinite scroll handler
   */
  private handleScrollEnd(height: number): void {
    if (this.isLoading()) return;
    if (!this.hasNext()) return;
    if (height <= this.lastHeight) return;

    this.lastHeight = height;
    this.loadNext();
  }

  /**
   * Load feed data from API
   */
  loadAll(reset = false): void {
    this.isLoading.set(true);

    const req = {
      page: this.page() - 1, // internal
      size: this.itemsPerPage, // internal
      sessionKey: this.sessionKey(),
      q: this.query(),
    };

    this.postService
      .feeds(req)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: HttpResponse<IFeedPageDTO>) => {
          const { body } = res;
          this.hasNext.set(body.content.length > 0);
          console.log(body.sessionKey);

          if (reset) {
            this.sessionKey.set(body.sessionKey);
            this.feeds.set(body.content ?? []);
          } else {
            this.feeds.update((e) => [...e, ...body.content]);
          }
        },
        error: () =>
          this.alertService.addAlert({
            type: 'warning',
            message: 'Problème de chargement',
          }),
      });
  }

  /**
   * Triggered when user clicks search button.
   * Only updates the URL with the query (NOT page/size).
   */
  search(): void {
    if (!this.hasMinimumQueryLength()) return;
    this.handleNavigation(this.query());
  }

  /**
   * Navigation that ONLY exposes the search query in the URL.
   * Pagination stays internal.
   */
  protected handleNavigation(query?: string): void {
    this.ngZone.run(() => {
      this.router.navigate(['/'], {
        relativeTo: this.activatedRoute,
        queryParams: { q: query || null }, // ONLY q is visible
      });
    });
  }
}

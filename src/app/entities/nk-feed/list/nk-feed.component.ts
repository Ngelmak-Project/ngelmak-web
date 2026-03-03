import { Component, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, Subscription, tap } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE, PAGE_HEADER } from 'app/config/pagination.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { IFeedDTO } from 'app/entities/models/nk-feed.model';
import SharedModule from 'app/shared/shared.module';
import { SortService, sortStateSignal } from 'app/shared/sort';

import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { PostCardComponent } from 'app/entities/nk-post/card/nk-post-card.component';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { IPage } from 'app/shared/pagination/pagination.model';
import { ScrollService } from 'app/shared/services/scroll.service';
import { FeedService } from '../nk-feed.service';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-feed',
  templateUrl: './nk-feed.component.html',
  imports: [RouterModule, FormsModule, SharedModule, PostCardComponent, PostUpdateComponent],
  animations: [fadeInUp400ms],
})
export class FeedComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  feeds = signal<IFeedDTO[]>([]);
  hasNext = signal(true);
  isLoading = signal(false);

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;
  query = '';

  // Track last known scrollHeight to avoid reloading when height doesn't change
  private lastHeight = 0;

  public router = inject(Router);
  protected feedService = inject(FeedService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected authService = inject(AuthenticationService);
  protected scroll = inject(ScrollService);
  channel = inject(ChannelService).channel;

  protected ngZone = inject(NgZone);

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
          tap(() => this.loadAll(true)), // reset feeds
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // unsubscribes ALL at once
  }

  /**
   * Respond to the creation of the event. Add the newly created message to the feed list.
   * @param newPost creted post.
   */
  handlePostSaved(newPost: IPostDTO): void {
    this.feeds.update((list) => [{ id: null, post: newPost }, ...list]);
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

    this.feedService
      .query(req)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: HttpResponse<IPage<IFeedDTO>>) => {
          const { body } = res;
          this.hasNext.set(body.content.length == this.itemsPerPage);
          if (reset) {
            this.feeds.set(body.content ?? []);
          } else {
            this.feeds.update((e) => [...e, ...body.content]);
          }
        },
        error: () =>
          inject(AlertService).addAlert({ type: 'warning', message: 'Problème de chargement' }),
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

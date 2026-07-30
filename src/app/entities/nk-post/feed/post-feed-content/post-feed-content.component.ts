import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { VisibleTriggerDirective } from 'app/shared/scrool-detection/visible-trigger.directive';
import { combineLatest, finalize, Subscription, tap } from 'rxjs';
import { PostCardComponent } from '../../card/nk-post-card.component';
import { PostService } from '../../nk-post.service';
import { PostFeedStateService } from '../nk-post-feed-state.service';
import { SkeletonComponent } from 'app/shared/skeleton/skeleton.component';

@Component({
  selector: 'app-post-feed-content.component',
  imports: [PostCardComponent, VisibleTriggerDirective, SkeletonComponent],
  templateUrl: './post-feed-content.component.html',
})
export class PostFeedContentComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private alertService = inject(AlertService);
  private state = inject(PostFeedStateService);

  private subs = new Subscription();

  // Feed data
  feeds = signal<IPostDTO[]>([]);
  hasNext = signal(true);
  isLoading = signal(false);

  // Pagination continuity
  sessionKey = signal<string | null>(null);

  // Internal pagination
  page = signal(1);
  readonly itemsPerPage = ITEMS_PER_PAGE;

  // URL-driven state
  query = signal('');
  range = signal<'feed' | 'week' | 'month'>('feed');

  constructor() {
    // Parent created a new post → prepend it
    effect(() => {
      const newPost = this.state.newPost();
      if (newPost) {
        this.feeds.update((list) => [newPost, ...list]);
      }
    });
  }

  ngOnInit(): void {
    this.subs.add(
      combineLatest([this.route.queryParamMap, this.route.url])
        .pipe(
          tap(([params, segments]) => {
            // Search query from URL
            this.query.set((params.get('q') ?? '').trim());

            // Range from route path
            const path = segments[0]?.path ?? '';
            this.range.set(path === 'week' ? 'week' : path === 'month' ? 'month' : 'feed');

            // Reset pagination
            this.page.set(1);
          }),
          tap(() => this.loadAll(true)),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Infinite scroll handler
  handleScrollEnd(): void {
    if (this.isLoading()) return;
    if (!this.hasNext()) return;
    if (this.feeds().length === 0) return;
    this.loadNext();
  }

  loadNext(): void {
    this.page.update((p) => p + 1);
    this.loadAll();
  }

  private loadAll(reset = false): void {
    this.isLoading.set(true);

    const req = {
      page: this.page() - 1,
      size: this.itemsPerPage,
      sessionKey: this.sessionKey(),
      q: this.query(),
      range: this.range(),
    };

    this.postService
      .feeds(req)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.state.finishSearch(); // CHILD tells parent “search finished”
        }),
      )
      .subscribe({
        next: (res) => {
          const body = res.body!;
          const content = body.content ?? [];

          this.hasNext.set(content.length > 0);

          if (reset) {
            this.sessionKey.set(body.sessionKey);
            this.feeds.set(content);
          } else {
            this.feeds.update((list) => [...list, ...content]);
          }
        },
        error: () => {
          this.alertService.addAlert({
            type: 'warning',
            translationKey: 'ngelmakTranslation.entities.post.feed.alerts.error',
            message: 'Problème de chargement',
          });
        },
      });
  }

  handlePostDeleted(deletedPost: IPostDTO): void {
    this.feeds.update((list) => list.filter((p) => p.id != deletedPost.id));
  }
}

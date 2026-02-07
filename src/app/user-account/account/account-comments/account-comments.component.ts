import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, NgZone, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITEMS_PER_PAGE, PAGE_HEADER } from 'app/config/pagination.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { CommentItemComponent } from 'app/entities/nk-comment/list/item/nk-comment-item.component';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ScrollService } from 'app/shared/services/scroll.service';
import { SortService } from 'app/shared/sort';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: ' app-account-comments',
  templateUrl: './account-comments.component.html',
  imports: [CommonModule, RouterModule, CommentItemComponent],
  animations: [fadeInUp400ms],
})
export class AccountCommentsComponent {
  private subs = new Subscription();
  protected accountService = inject(AccountService);
  protected commentService = inject(CommentService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected authService = inject(AuthenticationService);
  protected scroll = inject(ScrollService);
  private router = inject(Router);

  account = inject(AccountService).account;
  comments = signal<ICommentDTO[]>([]);

  isLoading = signal(false);
  query = signal('');
  page = signal(1);
  itemsPerPage = ITEMS_PER_PAGE;

  hasNext = signal(false);

  protected ngZone = inject(NgZone);

  // Track last known scrollHeight to avoid reloading when height doesn't change
  private lastHeight = 0;

  constructor() {
    effect(() => {
      const acc = this.account();
      if (!acc) return; // wait until account is loaded

      // Now it's safe to load comments
      this.loadAll(true);
    });
  }

  ngOnInit(): void {
    // Scroll listener
    this.subs.add(
      this.scroll.endReached$.subscribe((height) => {
        this.handleScrollEnd(height);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // unsubscribes ALL at once
  }

  filteredComments = computed(() => {
    const q = this.query().toLowerCase();
    const list = this.comments();

    if (!q) return list;

    return list.filter(
      (c) => c.content.toLowerCase().includes(q)
    );
  });

  loadNext() {
    this.page.update((p) => p + 1);
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
      page: this.page() - 1,
      size: this.itemsPerPage,
      q: this.query(),
    };

    this.commentService.findByAccount(this.account()!.id, req).subscribe({
      next: (res) => {
        const { body } = res;

        this.hasNext.set(body.content.length === this.itemsPerPage);

        if (reset) {
          this.comments.set(body.content ?? []);
        } else {
          this.comments.update((e) => [...e, ...body.content]);
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

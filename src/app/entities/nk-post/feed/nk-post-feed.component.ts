import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import SharedModule from 'app/shared/shared.module';
import { PostFeedStateService } from './nk-post-feed-state.service';

@Component({
  standalone: true,
  selector: 'app-post-feed',
  templateUrl: './nk-post-feed.component.html',
  imports: [RouterModule, FormsModule, SharedModule, PostUpdateComponent],
  animations: [fadeInUp400ms],
})
export class PostFeedComponent {
  private router = inject(Router);
  private state = inject(PostFeedStateService);

  isLoading = signal(false);
  // Search query (visible in URL)
  query = signal('');
  /**
   * Computed boolean: search is allowed only if query length >= 5
   */
  validForSearch = computed(() => !this.isLoading() && this.query().length >= 5);
  isSearching = this.state.isSearching;

  /**
   * Add newly created post to the top of the feed.
   */
  handlePostSaved(post: any) {
    this.state.pushNewPost(post); // notify child
  }

  /**
   * Triggered when user clicks search button.
   * Only updates the URL with the query (NOT page/size).
   */
  search(): void {
    if (!this.validForSearch()) return;

    this.state.startSearch(); // parent sets searching=true

    this.router.navigate(['/search'], {
      queryParams: { q: this.query() },
    });
  }

  /**
   * Navigates to the search page when a non‑empty query is provided.
   * Falls back to the home route when the query is empty or whitespace.
   *
   * - Non‑empty query → /search?q=<query>
   * - Empty query     → /
   */
  protected handleNavigation(query?: string): void {
    const q = (query ?? '').trim();

    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      return;
    }

    this.router.navigate(['/']);
  }
}

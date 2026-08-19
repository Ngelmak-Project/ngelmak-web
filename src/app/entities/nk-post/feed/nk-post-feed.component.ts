import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import SharedModule from 'app/shared/shared.module';
import { PostFeedStateService } from './nk-post-feed-state.service';

@Component({
  standalone: true,
  selector: 'app-post-feed',
  templateUrl: './nk-post-feed.component.html',
  imports: [RouterModule, FormsModule, SharedModule, PostUpdateComponent],
})
export class PostFeedComponent {
  private state = inject(PostFeedStateService);

  isLoading = signal(false);
  isSearching = this.state.isSearching;

  /**
   * Add newly created post to the top of the feed.
   */
  handlePostSaved(post: any) {
    this.state.pushNewPost(post); // notify child
  }
}

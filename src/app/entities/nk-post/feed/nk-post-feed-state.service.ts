import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PostFeedStateService {
  // Parent owns this
  isSearching = signal(false);

  // Child calls this when done
  finishSearch() {
    this.isSearching.set(false);
  }

  // Parent calls this when search starts
  startSearch() {
    this.isSearching.set(true);
  }

  // New post event (child listens to this)
  newPost = signal<any | null>(null);

  pushNewPost(post: any) {
    this.newPost.set(post);
  }
}

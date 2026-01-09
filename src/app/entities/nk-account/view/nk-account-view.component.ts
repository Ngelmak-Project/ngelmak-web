import { Component, inject, OnInit, signal } from "@angular/core";

import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IPost } from "app/entities/models/nk-post.model";
import { PostService } from "app/entities/nk-post/nk-post.service";
import { finalize } from "rxjs";
import { DurationPipe } from "app/shared/date";

@Component({
  standalone: true,
  selector: "app-nk-account-view",
  templateUrl: "./nk-account-view.component.html",
  imports: [CommonModule, DurationPipe, RouterModule],
})
export class NkAccountViewComponent implements OnInit {
  nkAccount = signal(null);
  route = inject(ActivatedRoute);

  postService = inject(PostService);
  posts = signal<IPost[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.nkAccount.set(this.route.snapshot.data["nkAccount"]);
    this.isLoading.set(true);
    this.postService
      .findByNkAccount(this.route.snapshot.data["nkAccount"].id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => this.posts.set(res.body.content));
  }

  previousState(): void {
    window.history.back();
  }
}

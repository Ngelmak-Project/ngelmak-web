import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AccountService } from "app/entities/nk-account/nk-account.service";
import { IPost } from "app/entities/models/nk-post.model";
import { PostService } from "app/entities/nk-post/nk-post.service";
import { DurationPipe } from "app/shared/date";
import { finalize, switchMap } from "rxjs";

@Component({
  selector: "app-posts",
  standalone: true,
  templateUrl: "./posts.component.html",
  imports: [CommonModule, RouterModule, DurationPipe],
})
export class PostsComponent implements OnInit {
  nkAccountService = inject(AccountService);
  postService = inject(PostService);
  posts = signal<IPost[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.nkAccountService
      .currentAccount()
      .pipe(
        switchMap((account) => this.postService.findByNkAccount(account.id))
      )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => (this.posts.set(res.body.content)));
  }
}

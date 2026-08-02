import { Component, inject, OnInit, signal } from "@angular/core";

import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IPost } from "app/entities/models/nk-post.model";
import { PostService } from "app/entities/nk-post/nk-post.service";
import { DurationPipe } from "app/shared/date";
import { ChannelInitialsPipe } from "app/shared/pipes/channel-initials.pipe";
import { finalize } from "rxjs";

@Component({
  standalone: true,
  selector: "app-channel",
  templateUrl: "./nk-channel.component.html",
  imports: [CommonModule, RouterModule, DurationPipe, ChannelInitialsPipe],
})
export class ChannelViewComponent implements OnInit {
  channel = signal(null);
  route = inject(ActivatedRoute);

  postService = inject(PostService);
  posts = signal<IPost[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.channel.set(this.route.snapshot.data["channel"]);
    this.isLoading.set(true);
    this.postService
      .findByChannel(this.route.snapshot.data["channel"].id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => this.posts.set(res.body.content));
  }

  previousState(): void {
    window.history.back();
  }
}

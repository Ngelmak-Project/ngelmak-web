import {
  Component,
  inject,
  OnInit,
  signal
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IAttachment } from "app/entities/models/nk-attachment.model";
import { IComment } from "app/entities/models/nk-comment.model";
import { IPost } from "app/entities/models/nk-post.model";
import { AccountService } from "app/entities/nk-account/nk-account.service";
import { CommentService } from "app/entities/nk-comment/nk-comment.service";
import { CommentUpdateComponent } from "app/entities/nk-comment/update/nk-comment-update.component";
import { fadeInUp400ms } from "app/shared/animations/fade-in-up.animation";
import { scaleInOut400ms } from "app/shared/animations/scale-in-out.animation";
import { scaleInOutAnimation150ms } from "app/shared/animations/stagger.animation";
import { DurationPipe } from "app/shared/date";
import SharedModule from "app/shared/shared.module";

@Component({
  standalone: true,
  selector: "app-post-detail",
  templateUrl: "./nk-post-detail.component.html",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommentUpdateComponent,
    DurationPipe,
    SharedModule,
    RouterModule,
  ],

  animations: [fadeInUp400ms, scaleInOut400ms, scaleInOutAnimation150ms],
})
export class PostDetailComponent implements OnInit {
  post: IPost | null = null;
  comments = signal<IComment[]>([]);
  attachments = signal<IAttachment[]>([]);
  nkAccountService = inject(AccountService);
  nkAccount = inject(AccountService).trackCurrentAccount();
  commentService = inject(CommentService);
  route = inject(ActivatedRoute);

  updatingComment = signal(null);

  ngOnInit(): void {
    this.post = this.route.snapshot.data["post"];
    this.comments.set(this.post.comments);
    this.attachments.set(this.post.attachments);
    this.nkAccountService.currentAccount().subscribe();
    // this.loadAllComments();
  }

  sortReverse(comments: IComment[]): IComment[] {
    return comments.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  }

  onSaveSuccess(comment: IComment) {
    const comments = this.comments();
    const idx = comments.findIndex((item) => item.id == comment.id);
    if (idx >= 0) {
      comments[idx] = comment;
    } else {
      comments.push(comment);
    }
    this.updatingComment.set(null); // reset the updating.
    this.comments.set(comments);
  }

  loadAllComments() {
    this.commentService
      .findByPost(this.post.id)
      .subscribe((res) => this.comments.set(res.body));
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments.set(this.comments().filter((e) => e.id != id));
    });
  }

  previousState(): void {
    window.history.back();
  }
}

import { Component, inject, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';

import { FormsModule } from '@angular/forms';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import SharedModule from 'app/shared/shared.module';

import { CommentReactionDialogComponent } from 'app/entities/nk-comment-reaction/dialog/nk-comment-reaction-dialog.component';
import { DurationPipe } from 'app/shared/date';

@Component({
  standalone: true,
  selector: 'app-comment-item',
  templateUrl: './nk-comment-item.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    DurationPipe,
    CommentUpdateComponent,
    CommentReactionDialogComponent,
  ],
})
export class CommentItemComponent {
  @Input() level: number = 0;
  @Input() comment: ICommentDTO;

  protected commentService = inject(CommentService);
  replies = signal<ICommentDTO[]>([]);
  isLoading = signal(false);
  isReplying = signal(false);
  showReplies = signal(false);

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  toggleReplies() {
    this.showReplies.set(!this.showReplies());
    if (this.replies().length == 0) {
      this.isLoading.set(true);
      this.commentService.findRepliesByComment(this.comment.id).subscribe({
        next: (res) => this.replies.set(res.body),
        complete: () => this.isLoading.set(false),
      });
    }
  }

  onReply(newComment: ICommentDTO) {
    this.comment.replyCount++;
    this.replies().push(newComment);
  }
}

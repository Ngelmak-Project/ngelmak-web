import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';

import { ICommentDTO } from 'app/entities/models/nk-comment.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { CommentReactionDialogComponent } from 'app/entities/nk-comment-reaction/dialog/nk-comment-reaction-dialog.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { DurationPipe } from 'app/shared/date';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-comment-item',
  templateUrl: './nk-comment-item.component.html',
  imports: [
    CommonModule,
    RouterModule,
    DurationPipe,
    CommentUpdateComponent,
    CommentReactionDialogComponent,
    ClickOutsideDirective,
    ConfirmDialogComponent,
  ],
})
export class CommentItemComponent implements OnInit {
  comment = input<ICommentDTO>();
  commentSig = signal<ICommentDTO | null>(null);
  level = input(0);
  replyTo = input<ICommentDTO>(null);
  onDeleted = output<ICommentDTO>();

  protected commentService = inject(CommentService);
  protected alertService = inject(AlertService);
  channel = inject(ChannelService).channel;

  replies = signal<ICommentDTO[]>([]);
  isLoading = signal(false);
  isReplying = signal(false);
  isUpdating = signal(false);
  isDeleting = signal(false);
  showReplies = signal(false);
  openMenu = signal(false);
  confirmDeleteOpen = signal(false);

  ngOnInit() {
    this.commentSig.set(this.comment());
  }

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
      this.commentService.findRepliesByComment(this.commentSig().id).subscribe({
        next: (res) => this.replies.set(res.body),
        complete: () => this.isLoading.set(false),
      });
    }
  }

  /**
   * Handles the result of a reply or an edit action.
   *
   * - If the returned comment has a different ID than the current one,
   *   it represents a *new reply*, so we append it to the replies list
   *   and increment the reply counter.
   *
   * - If the IDs match, the user edited the current comment,
   *   so we simply update the comment in place.
   */
  handleReplyOrUpdate(newComment: ICommentDTO) {
    const isNewReply = newComment.id !== this.commentSig().id;

    if (isNewReply) {
      // this.comment.replyCount++;
      this.commentSig.update((c) => ({ ...c, replyCount: c.replyCount + 1 }));
      this.replies().push(newComment);
    } else {
      this.isUpdating.set(false);
      this.commentSig.update((c) => ({ ...c, ...newComment }));
    }
  }

  handleDeleteConfirm(result: boolean) {
    this.confirmDeleteOpen.set(false);
    if (result) {
      this.isDeleting.set(true);
      this.commentService
        .delete(this.commentSig().id)
        .pipe(finalize(() => {
          this.isDeleting.set(false);
          this.openMenu.set(false);
        }))
        .subscribe({
          next: () => {
            this.onDeleted.emit(this.commentSig());
          },
          error: () =>
            this.alertService.addAlert({
              type: 'error',
              message: "Une error s'est produit lors de la suppression.",
            }),
        });
    }
  }

  /**
   * Removes a deleted comment from the local reply list and updates
   * the comment's reply count accordingly.
   *
   * This method is typically called after the API confirms that a comment
   * has been successfully deleted on the server.
   *
   * @param deleteComment - The comment object returned by the delete action,
   *                        containing at least the ID of the removed comment.
   */
  onDeletedReply(deleteComment: ICommentDTO) {
    // Decrement the total comment count for the post
    this.commentSig.update((c) => ({ ...c, replyCount: c.replyCount - 1 }));
    // Update the reactive replies signal with the new list
    this.replies.update((list) => list.filter((c) => c.id !== deleteComment.id));
  }
}

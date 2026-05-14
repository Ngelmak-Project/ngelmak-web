import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';
import { TicketDialogComponent } from 'app/entities/nk-ticket/dialog/nk-ticket-dialog.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { DurationPipe } from 'app/shared/date';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { HasChannelDirective } from 'app/shared/directives/has-channel';
import { ShowForChannelDirective } from 'app/shared/directives/show-for-channel';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-comment-item',
  templateUrl: './nk-comment-item.component.html',
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DurationPipe,
    CommentUpdateComponent,
    ClickOutsideDirective,
    TicketDialogComponent,
    ShowForChannelDirective,
    HasChannelDirective,
  ],
})
export class CommentItemComponent {
  comment = input<ICommentDTO>();
  commentSig = signal<ICommentDTO | null>(null);
  level = input(0);
  replyTo = input<ICommentDTO>(null);
  ondelete = output<ICommentDTO>(); // Signal to emit the deleted comment back to the parent component.

  protected commentService = inject(CommentService);
  protected alertService = inject(AlertService);
  activeChannel = inject(ChannelService).channel;

  replies = signal<ICommentDTO[]>([]);
  isLoading = signal(false);
  isReplying = signal(false);
  isUpdating = signal(false);
  isDeleting = signal(false);
  isSignalComment = signal(false);
  showReplies = signal(false);
  showMenu = signal(false);
  confirmDeleteOpen = signal(false);

  constructor() {
    effect(() => {
      if (this.comment()) {
        const comment = this.comment();
        this.commentSig.set(comment);
      }
    });
  }

  /**
   * Toggles the visibility of the replies section for the current comment. If the replies have not been loaded yet, it triggers an API call to fetch the replies from the server.
   */
  toggleReplies(): void {
    this.showReplies.set(!this.showReplies());
    if (this.replies().length == 0) {
      this.isLoading.set(true);
      const storedReplyCount = this.commentSig().replyCount || 0;
      this.commentService.findRepliesByComment(this.commentSig().id, storedReplyCount).subscribe({
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

  /**
   * Handles the cancellation of a reply or an edit action. This method is called when the user cancels the comment creation or update process.
   */
  handleCancelReplyOrUpdate() {
    this.isReplying.set(false);
  }

  /**
   * Handles the confirmation of a comment deletion. If the user confirms the deletion, it calls the API to delete the comment and emits the deleted comment back to the parent component so it can be removed from the list.
   */
  handleDeleteConfirm(result: boolean): void {
    this.confirmDeleteOpen.set(false);
    if (result) {
      this.isDeleting.set(true);
      this.commentService
        .delete(this.commentSig().id)
        .pipe(
          finalize(() => {
            this.isDeleting.set(false);
            this.showMenu.set(false);
          }),
        )
        .subscribe({
          next: () => {
            // Emit the deleted comment back to the parent component so it can be removed from the list.
            this.ondelete.emit(this.commentSig());
            this.alertService.addAlert({
              type: 'success',
              translationKey: 'nkApp.comment.deleted',
              message: 'Commentaire supprimé.',
            });
          },
          error: () =>
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'nkApp.comment.deleteError',
              message: "Une erreur s'est produite lors de la suppression du commentaire.",
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

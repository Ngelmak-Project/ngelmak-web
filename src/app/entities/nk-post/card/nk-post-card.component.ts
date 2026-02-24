import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { CommentComponent } from 'app/entities/nk-comment/list/nk-comment.component';
import { ReactionDialogComponent } from 'app/entities/nk-reaction/dialog/nk-reaction-dialog.component';
import { TicketDialogComponent } from 'app/entities/nk-ticket/dialog/nk-ticket-dialog.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { DurationPipe } from 'app/shared/date';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { ShowForChannelDirective } from 'app/shared/directives/show-for-channel';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { PostService } from '../nk-post.service';
import { PostUpdateComponent } from '../update/nk-post-update.component';

@Component({
  standalone: true,
  selector: 'app-post-card',
  templateUrl: './nk-post-card.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    DurationPipe,
    CommentComponent,
    PostUpdateComponent,
    ClickOutsideDirective,
    ConfirmDialogComponent,
    ReactionDialogComponent,
    ShowForChannelDirective,
    TicketDialogComponent,
  ],
})
export class PostCardComponent {
  post = input.required<IPostDTO>(); // The post to display
  ondeleted = output<IPostDTO>(); // Event emitted when the post is deleted.

  postSig = signal<IPostDTO>(null); // Signal to hold the current post data, allowing for reactive updates.
  channel = inject(ChannelService).channel; // connected user's channel.
  showMenu = signal(false);
  confirmDeleteOpen = signal(false);
  isDeleting = signal(false);
  isUpdating = signal(false);
  isCommentOpened = signal(false);
  isSignalPost = signal(false); // Signal emit when user wanna signal a post.

  alertService = inject(AlertService);
  protected postService = inject(PostService);

  constructor() {
    effect(() => {
      const post = this.post();
      this.postSig.set(post);
    });
  }

  isImage(file: IFile): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: IFile): boolean {
    return file.type.startsWith('video/');
  }

  extention(file: IFile): string {
    return file.type.split('/').pop()?.toUpperCase();
  }

  /**
   * Handle update signal when post is updated.
   * @param newPost updated post.
   */
  handlePostUpdate(newPost: IPostDTO) {
    this.isUpdating.set(false);
    this.postSig.update((p) => ({ ...p, content: newPost.content, files: newPost.files }));
  }

  /**
   * Delete user's post from the database when confirmation is positive. Discard otherwise.
   * @param result confirmation of the deletion.
   */
  handleDeleteConfirm(result: boolean) {
    this.confirmDeleteOpen.set(false); // Close the confirmation dialog.
    if (!result) return;
    this.isDeleting.set(true);
    this.postService
      .delete(this.postSig().id)
      .pipe(
        finalize(() => {
          this.isDeleting.set(false);
          this.showMenu.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.ondeleted.emit(this.postSig());
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            message: "Une error s'est produit lors de la suppression.",
          }),
      });
  }
}

import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
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
  hideFollwing = input(false); // Whether to hide the follow/unfollow button (used in channel feed to avoid showing follow button on own posts)
  ondeleted = output<IPostDTO>(); // Event emitted when the post is deleted.

  protected postService = inject(PostService);
  protected alertService = inject(AlertService);
  channelService = inject(ChannelService);
  channel = inject(ChannelService).channel; // connected user's channel.

  postSig = signal<IPostDTO>(null); // Signal to hold the current post data, allowing for reactive updates.
  showMenu = signal(false);
  confirmDeleteOpen = signal(false);
  isDeleting = signal(false);
  isReplying = signal(false);
  isUpdating = signal(false);
  isCommentOpened = signal(false);
  isSignalPost = signal(false); // Signal emit when user wanna signal a post.
  isSubscriptionToggling = signal(false);

  content = computed(() => this.postSig().content.replace(/\\n/g, '\n'));

  /**
   * Computes the subscription ID for the current channel.
   * Looks at the list of channels this channel is following and
   * returns the ID of the subscription linking it to the post's channel.
   * Returns null when no matching subscription exists.
   */
  subscription = computed(() => {
    // No channel loaded → no subscription possible
    if (!this.channel()) return null;

    // Find the subscription where this channel follows the post's channel
    return this.channel().stats.following.find((e) => e.subscribedToId === this.post().channel.id);
  });

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
    this.isReplying.set(false);
    this.postSig.update((p) => ({ ...p, content: newPost.content, files: newPost.files }));
  }

  /**
   * Handle cancel signal when user cancel an update or a reply.
   * Just close the update/reply form without doing any API call.
   */
  handleCancelUpdate() {
    this.isUpdating.set(false);
    this.isReplying.set(false);
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

  /**
   * Toggles the user's subscription status for the channel owner of the post.
   * - If already subscribed → unfollows and removes the local subscription.
   * - If not subscribed → follows and stores the new subscription locally.
   */
  toggleFollow() {
    // Mark that a follow/unfollow action is in progress
    this.isSubscriptionToggling.set(true);

    const action$ = this.subscription()
      ? this.channelService.unfollow(this.subscription().id)
      : this.channelService.follow(this.postSig().channel);
    action$.pipe(finalize(() => this.isSubscriptionToggling.set(false))).subscribe({
      next: (res: any) => {
        if (this.subscription()) {
          this.channelService.removeLocalSubs(this.subscription().id);
        } else {
          this.channelService.addLocalSubs(res.body);
        }
      },
    });
  }
}

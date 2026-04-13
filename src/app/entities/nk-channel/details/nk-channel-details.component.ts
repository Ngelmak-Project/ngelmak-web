import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IChannel, ISubscriptionDTO } from 'app/entities/models/nk-channel.model';
import { ChannelFeedComponent } from 'app/entities/nk-post/channel-feed/channel-feed.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInRight400ms } from 'app/shared/animations/fade-in-right.animation';
import SharedModule from 'app/shared/shared.module';
import { TranslateDirective } from "app/shared/translation/translate.directive";
import { finalize } from 'rxjs';
import { ChannelService } from '../nk-channel.service';
import { ChannelUpdateComponent } from '../update/nk-channel-update.component';

@Component({
  standalone: true,
  selector: 'app-channel-details',
  templateUrl: './nk-channel-details.component.html',
  imports: [CommonModule, RouterModule, ChannelUpdateComponent, ChannelFeedComponent, TranslateDirective, SharedModule],
  animations: [fadeInRight400ms],
})
export class ChannelDetailComponent {
  /**
   * The channel to display, passed as an input.
   */
  channel = input.required<IChannel>();

  protected alertService = inject(AlertService);
  protected channelService = inject(ChannelService);
  /**
   * The current user's channel, used for determining subscription status and permissions.
   */
  private userChannel = this.channelService.channel;

  // VIEW SIGNALS
  isUploading = signal(false);
  isUpdating = signal(false);
  // 'avatar' | 'banner' | null
  editing = signal<'avatar' | 'banner' | null>(null);
  // Preview file before upload
  filePreview = signal<{ type: 'avatar' | 'banner'; data: File; url: string } | null>(null);
  isSubscriptionToggling = signal(false);

  /**
   * Handle file selection for avatar or banner.
   */
  handleImage(event: Event, type: 'avatar' | 'banner') {
    const input = event.target as HTMLInputElement;
    const data = input.files?.[0];

    if (!data) return;

    const preview = {
      type,
      data,
      url: URL.createObjectURL(data),
    };

    this.filePreview.set(preview);
    this.editing.set(type);
  }

  /**
   * Upload avatar or banner depending on the current editing type.
   */
  upload() {
    const preview = this.filePreview();
    if (!preview) return;

    this.isUploading.set(true);

    const request =
      preview.type === 'avatar'
        ? this.channelService.updateAvatar(preview.data)
        : this.channelService.updateBanner(preview.data);

    request
      .pipe(
        finalize(() => {
          this.isUploading.set(false);
          this.cancelEdit();
        }),
      )
      .subscribe({
        next: (res) => {
          this.channelService.updateLocalChannel(res.body);
          // Cleanup
          URL.revokeObjectURL(preview.url);
          this.filePreview.set(null);
          this.editing.set(null);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            message: "Une erreur s'est produite lors de la mise à jour.",
          }),
      });
  }

  /**
   * Cancel editing and cleanup preview.
   */
  cancelEdit() {
    const preview = this.filePreview();
    if (preview) URL.revokeObjectURL(preview.url);

    this.filePreview.set(null);
    this.editing.set(null);
  }

  /**
   * Computes the subscription ID for the current channel.
   * Looks at the list of channels this channel is following and
   * returns the ID of the subscription linking it to the post's channel.
   * Returns null when no matching subscription exists.
   */
  subscription = computed<ISubscriptionDTO | null>(() => {
    // No channel loaded → no subscription possible
    if (!this.userChannel()) return null;

    // Find the subscription where this channel follows the post's channel
    return this.userChannel().stats.following.find(
      (e) => e.subscribedToId === this.userChannel().id,
    );
  });

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
      : this.channelService.follow(this.userChannel());
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

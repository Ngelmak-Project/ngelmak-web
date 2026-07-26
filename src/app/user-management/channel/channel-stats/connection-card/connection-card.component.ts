import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IChannelDTO, ISubscriptionDetailDTO } from 'app/entities/models/nk-channel.model';

@Component({
  selector: 'connection-card',
  standalone: true,
  templateUrl: './connection-card.component.html',
  imports: [CommonModule, RouterModule],
})
export class UserConnectionCardComponent {
  /** Subscription DTO */
  subscription = input.required<ISubscriptionDetailDTO>();

  /** Whether the user is following this channel */
  isFollowing = input<boolean>(false);

  /** Whether a follow/unfollow action is in progress */
  isToggling = input<boolean>(false);

  /** Emits when follow/unfollow is clicked */
  toggleSubscription = output<void>();

  /**
   * The channel displayed in the card.
   */
  channel = computed<IChannelDTO | undefined>(() => {
    const sub = this.subscription();
    if (!sub) return undefined;

    return this.isFollowing() ? sub.subscribedTo : sub.subscriber;
  });
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ISubscriptionDetailDTO } from 'app/entities/models/nk-channel.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserConnectionCardComponent } from "./connection-card/connection-card.component";

@Component({
  selector: 'app-channel-stats',
  templateUrl: './channel-stats.component.html',
  imports: [CommonModule, SharedModule, UserConnectionCardComponent],
  animations: [fadeInUp400ms],
})
export class ChannelStatsComponent implements OnInit {  private channelService = inject(ChannelService);

  // Tab selection
  activeTab = signal<'following' | 'followers'>('following');

  // Following list
  following = signal<ISubscriptionDetailDTO[]>([]);
  followingIsLoading = signal(false);

  // Followers list
  followers = signal<ISubscriptionDetailDTO[]>([]);
  followersIsLoading = signal(false);

  // Track toggling subscriptions
  togglingSubscriptions = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    this.followingIsLoading.set(true);
    this.followersIsLoading.set(true);

    this.channelService
      .getSubscriptions()
      .pipe(
        finalize(() => {
          this.followingIsLoading.set(false);
          this.followersIsLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          const subscriptions = response.body;

          // Separate into following and followers
          const following = subscriptions.filter(
            (sub: ISubscriptionDetailDTO) => sub.subscriber.id === this.getCurrentUserId()
          );
          const followers = subscriptions.filter(
            (sub: ISubscriptionDetailDTO) => sub.subscribedTo.id === this.getCurrentUserId()
          );

          this.following.set(following);
          this.followers.set(followers);
        },
        error: (error) => {
          console.error('Error loading connections:', error);
        }
      });
  }

  // Get current user ID (adjust based on your auth service)
  private getCurrentUserId(): number {
    // Return the current authenticated user's ID
    // This depends on your AuthService implementation
    return this.channelService.channel()?.id || 0;
  }

  // ============ SUBSCRIPTION TOGGLE ============
  toggleSubscription(channelId: number, isCurrentlyFollowing: boolean): void {
    this.togglingSubscriptions.update(set => {
      set.add(channelId);
      return new Set(set);
    });

    const action$ = isCurrentlyFollowing
      ? this.channelService.unfollow(channelId)
      : this.channelService.follow(null);

    action$.pipe(
      finalize(() => {
        this.togglingSubscriptions.update(set => {
          set.delete(channelId);
          return new Set(set);
        });
      })
    ).subscribe({
      next: () => {
        // Refresh the lists after toggle
        this.loadConnections();
      },
      error: (error) => {
        console.error('Subscription toggle failed:', error);
      }
    });
  }

  isChannelToggling(channelId: number): boolean {
    return this.togglingSubscriptions().has(channelId);
  }
}

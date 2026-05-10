import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPostDTO, ITrending } from 'app/entities/models/nk-post.model';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { finalize } from 'rxjs';
import { DurationPipe } from '../date';
import SharedModule from '../shared.module';

@Component({
  selector: 'app-trending',
  imports: [RouterModule, SharedModule, DurationPipe],
  templateUrl: './trending.component.html',
})
export class TrendingComponent {
  user = inject(AuthenticationService).authentication;
  postService = inject(PostService);
  showContactForm = signal(false);
  isLoadingTrends = signal(false);
  trending = signal<ITrending>(null);

  ngOnInit(): void {
    this.isLoadingTrends.set(true);
    this.postService
      .trending()
      .pipe(finalize(() => this.isLoadingTrends.set(false)))
      .subscribe((res) => this.trending.set(res.body));
  }

  reactionCount(post: IPostDTO): number {
    return Object.values(post.reactions.counts).reduce((a, b) => a + b, 0);
  }

  // Carousel signals
  trendingCarouselIndex = signal(0);
  commentedCarouselIndex = signal(0);
  autoplayEnabled = signal(true);
  autoplayInterval = 10000; // 10 seconds

  constructor() {
    // Auto-play trending carousel
    effect(() => {
      if (!this.autoplayEnabled() || !this.trending()?.trendingPosts?.length) return;

      const interval = setInterval(() => {
        this.nextTrendingSlide();
      }, this.autoplayInterval);

      return () => clearInterval(interval);
    });

    // Auto-play commented carousel
    effect(() => {
      if (!this.autoplayEnabled() || !this.trending()?.mostEngagedPosts?.length) return;

      const interval = setInterval(() => {
        this.nextCommentedSlide();
      }, this.autoplayInterval);

      return () => clearInterval(interval);
    });
  }

  // Pause autoplay on interaction
  pauseAutoplay() {
    this.autoplayEnabled.set(false);
  }

  resumeAutoplay() {
    this.autoplayEnabled.set(true);
  }

  nextTrendingSlide() {
    const posts = this.trending()?.trendingPosts;
    if (!posts || posts.length === 0) return;

    const currentIndex = this.trendingCarouselIndex();
    const nextIndex = (currentIndex + 1) % posts.length;
    this.trendingCarouselIndex.set(nextIndex);
  }

  previousTrendingSlide() {
    const posts = this.trending()?.trendingPosts;
    if (!posts || posts.length === 0) return;

    const currentIndex = this.trendingCarouselIndex();
    const previousIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
    this.trendingCarouselIndex.set(previousIndex);
  }

  goToTrendingSlide(index: number) {
    this.trendingCarouselIndex.set(index);
    this.pauseAutoplay();
    setTimeout(() => this.resumeAutoplay(), this.autoplayInterval * 2); // Resume after twice the interval to give users enough time to interact
  }

  nextCommentedSlide() {
    const posts = this.trending()?.mostEngagedPosts;
    if (!posts || posts.length === 0) return;

    const currentIndex = this.commentedCarouselIndex();
    const nextIndex = (currentIndex + 1) % posts.length;
    this.commentedCarouselIndex.set(nextIndex);
  }

  previousCommentedSlide() {
    const posts = this.trending()?.mostEngagedPosts;
    if (!posts || posts.length === 0) return;

    const currentIndex = this.commentedCarouselIndex();
    const previousIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
    this.commentedCarouselIndex.set(previousIndex);
  }

  goToCommentedSlide(index: number) {
    this.commentedCarouselIndex.set(index);
    this.pauseAutoplay();
    setTimeout(() => this.resumeAutoplay(), this.autoplayInterval * 2); // Resume after twice the interval to give users enough time to interact
  }

  /**
   * Percentage engagement score based on reactions and comments, with comments weighted more heavily.
   * @param post
   * @returns
   */
  postEngagement(post: IPostDTO): number {
    const posts = this.trending()?.mostEngagedPosts || [];

    if (!posts.length) {
      return 100; // Only this post, gets 100
    }

    const postInteractions = posts.map((p) => (p.commentCount || 0) * 2 + this.reactionCount(p));

    const totalInteractions = postInteractions.reduce((sum, val) => sum + val, 0);
    const postsWithEngagement = postInteractions.filter((val) => val > 0).length;

    const currentPostInteractions = (post.commentCount || 0) * 2 + this.reactionCount(post);

    let engagement: number;

    // If no posts have engagement, split evenly
    if (totalInteractions === 0) {
      engagement = 100 / posts.length;
    }
    // If current post has no engagement but others do
    else if (currentPostInteractions === 0) {
      const remainingPercentage = 100 / (postsWithEngagement || 1);
      engagement = remainingPercentage * 0.1;
    }
    // Current post has engagement, calculate proportionally
    else {
      engagement = (currentPostInteractions / totalInteractions) * 100;
    }

    // Floor to nearest 10
    return Math.floor(engagement / 10) * 10;
  }

  /**
   * Percentage engagement score for channels based on total posts, with more posts indicating higher engagement.
   * @param channel
   * @returns
   */
  channelEngagement(channel): number {
    const channels = this.trending()?.topActiveChannels || [];

    if (!channels.length) {
      return 100; // Only this channel, gets 100
    }

    const channelPostCounts = channels.map((c) => c.postCount || 0);
    const totalEngagement = channelPostCounts.reduce((sum, val) => sum + val, 0);
    const channelsWithEngagement = channelPostCounts.filter((val) => val > 0).length;

    const currentChannelPostCount = channel.postCount || 0;

    let engagement: number;

    // If no channels have posts, split evenly
    if (totalEngagement === 0) {
      engagement = 100 / channels.length;
    }
    // If current channel has no posts but others do
    else if (currentChannelPostCount === 0) {
      const remainingPercentage = 100 / (channelsWithEngagement || 1);
      engagement = remainingPercentage * 0.1;
    }
    // Current channel has posts, calculate proportionally
    else {
      engagement = (currentChannelPostCount / totalEngagement) * 100;
    }

    // Floor to nearest 10, minimum 10
    return Math.max(10, Math.floor(engagement / 10) * 10);
  }
}

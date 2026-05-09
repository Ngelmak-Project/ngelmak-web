import { Component, effect, inject, signal } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ITrending, IPostDTO } from 'app/entities/models/nk-post.model';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { finalize } from 'rxjs';
import { DurationPipe } from '../date';
import SharedModule from '../shared.module';

@Component({
  selector: 'app-trending',
  imports: [SharedModule, DurationPipe],
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
      if (!this.autoplayEnabled() || !this.trending()?.mostCommentedPosts?.length) return;

      const interval = setInterval(() => {
        this.nextCommentedSlide();
      }, this.autoplayInterval, );

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
    const posts = this.trending()?.mostCommentedPosts;
    if (!posts || posts.length === 0) return;

    const currentIndex = this.commentedCarouselIndex();
    const nextIndex = (currentIndex + 1) % posts.length;
    this.commentedCarouselIndex.set(nextIndex);
  }

  previousCommentedSlide() {
    const posts = this.trending()?.mostCommentedPosts;
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
}

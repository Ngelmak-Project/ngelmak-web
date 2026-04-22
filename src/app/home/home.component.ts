import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPostDTO, ITrending } from 'app/entities/models/nk-post.model';
import { ChannelOverviewComponent } from 'app/entities/nk-channel/overview/nk-channel-overview.component';
import { PostFeedComponent } from 'app/entities/nk-post/feed/nk-post-feed.component';
import { PostService } from 'app/entities/nk-post/nk-post.service';
import { ContactFormComponent } from 'app/pages/contact/contact-form/contact-form.component';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    SharedModule,
    RouterModule,
    PostFeedComponent,
    ChannelOverviewComponent,
    ContactFormComponent,
  ],
})
export default class HomeComponent implements OnInit {
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
}

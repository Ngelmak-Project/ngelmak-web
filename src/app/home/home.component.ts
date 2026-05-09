import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ChannelOverviewComponent } from 'app/entities/nk-channel/overview/nk-channel-overview.component';
import { PostFeedComponent } from 'app/entities/nk-post/feed/nk-post-feed.component';
import { ContactFormComponent } from 'app/pages/contact/contact-form/contact-form.component';
import SharedModule from 'app/shared/shared.module';
import { TrendingComponent } from 'app/shared/trending/trending.component';

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
    TrendingComponent,
  ],
})
export default class HomeComponent {
  user = inject(AuthenticationService).authentication;
  showContactForm = signal(false);
}

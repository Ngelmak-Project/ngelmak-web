import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ChannelOverviewComponent } from 'app/entities/nk-channel/overview/nk-channel-overview.component';
import { TrendingComponent } from 'app/entities/nk-post/feed/trending/trending.component';
import { ContactFormComponent } from 'app/pages/contact/contact-form/contact-form.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    SharedModule,
    RouterModule,
    ChannelOverviewComponent,
    ContactFormComponent,
    TrendingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  user = inject(AuthenticationService).authentication;
  showContactForm = signal(false);
}

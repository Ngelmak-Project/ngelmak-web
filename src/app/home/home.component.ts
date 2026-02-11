import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ChannelViewComponent } from 'app/entities/nk-channel/view/nk-channel-view.component';
import { FeedComponent } from 'app/entities/nk-feed/list/nk-feed.component';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import { ContactFormComponent } from 'app/pages/contact/contact-form/contact-form.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    SharedModule,
    RouterModule,
    PostUpdateComponent,
    FeedComponent,
    ChannelViewComponent,
    ContactFormComponent,
  ],
})
export default class HomeComponent {
  user = inject(AuthenticationService).authentication;

  showContactForm = signal(false);
}

import {
  Component,
  inject,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AccountViewComponent } from 'app/entities/nk-account/view/nk-account-view.component';
import { ContactMessageUpdateComponent } from 'app/entities/nk-contact-message/update/nk-contact-message-update.component';
import { FeedComponent } from 'app/entities/nk-feed/list/nk-feed.component';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [SharedModule, RouterModule, PostUpdateComponent, FeedComponent, AccountViewComponent, ContactMessageUpdateComponent],
})
export default class HomeComponent {
  user = inject(AuthenticationService).authentication;

  showContactForm = signal(false);

}

import {
  Component,
  inject
} from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AccountViewComponent } from 'app/entities/nk-account/view/nk-account-view.component';
import { FeedComponent } from 'app/entities/nk-feed/list/nk-feed.component';
import { PostUpdateComponent } from 'app/entities/nk-post/update/nk-post-update.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [SharedModule, PostUpdateComponent, FeedComponent, AccountViewComponent],
})
export default class HomeComponent {
  user = inject(AuthenticationService).authentication;
}

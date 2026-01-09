import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IMembership } from 'app/entities/models/nk-membership.model';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-membership-detail',
  templateUrl: './nk-membership-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class MembershipDetailComponent {
  membership = input<IMembership | null>(null);

  previousState(): void {
    window.history.back();
  }
}

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountDetailComponent } from '../../entities/nk-account/detail/nk-account-detail.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountReactionsComponent } from './account-reactions/account-reactions.component';
import { AccountStatsComponent } from './account-stats/app-account-stats.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountDetailComponent, AccountProfileComponent, AccountReactionsComponent, AccountStatsComponent],
  templateUrl: './account-page.component.html',
})
export class AccountPageComponent {
  section = signal("");
}

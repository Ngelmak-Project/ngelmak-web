import { Component, inject } from '@angular/core';
import { AccountService } from 'app/entities/nk-account/nk-account.service';

@Component({
  selector: ' app-account-profile',
  imports: [],
  templateUrl: './account-profile.component.html',
})
export class AccountProfileComponent {

  account = inject(AccountService).account;

}

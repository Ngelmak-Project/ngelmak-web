import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IAccount } from 'app/entities/models/nk-account.model';
import { AccountService } from '../nk-account.service';

@Component({
  standalone: true,
  templateUrl: './nk-account-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AccountDeleteDialogComponent {
  account?: IAccount;

  protected accountService = inject(AccountService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountService.delete(id).subscribe(() => {

    });
  }
}

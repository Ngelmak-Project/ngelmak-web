import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { form, max, required, Field } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { IAccount } from 'app/entities/models/nk-account.model';
import { AccountService } from '../nk-account.service';
import { finalize } from 'rxjs';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-account-view',
  templateUrl: './nk-account-view.component.html',
  imports: [CommonModule, RouterModule, Field],
})
export class AccountViewComponent {
  isLoading = signal(false);
  isSaving = signal(false);
  account = inject(AccountService).trackCurrentAccount();
  accountService = inject(AccountService);
  alertService = inject(AlertService);

  protected accountModel = signal<IAccount>({
    name: '',
  });

  protected accountForm = form(this.accountModel, (p) => {
    required(p.name, { message: 'Le nom de la chaine est obligatoire.' });
    max(p.name, 100, { message: 'Le nom ne doit pas dépasser 100 caractères.' });
  });

  save(): void {
    const account = this.accountForm().value();
    this.accountService
      .create(account)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (res) => {
          this.alertService.addAlert({
            type: 'success',
            message: 'Chaine créée avec succès!',
          });
          this.accountService.setAccount(res.body);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            message: 'Une erreur lors de la création.',
          }),
      });
  }
}

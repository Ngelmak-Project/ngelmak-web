import { HttpResponse } from '@angular/common/http';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';

import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IAccount } from 'app/entities/models/nk-account.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { AccountService } from '../nk-account.service';

@Component({
  standalone: true,
  selector: 'app-account-update',
  templateUrl: './nk-account-update.component.html',
  imports: [SharedModule, Field],
})
export class AccountUpdateComponent implements OnInit {
  account = input<IAccount>(null);
  onComplete = output<IAccount>();

  protected accountService = inject(AccountService);
  protected alertService = inject(AlertService);
  isSaving = signal(false);

  accountModel = signal<IAccount>({
    name: '',
    description: '',
  });

  accountForm = form(this.accountModel, (p) => {
    required(p.name, { message: 'Le nom du compte est requis.' });
    maxLength(p.name, 100, { message: 'Le nombre maximum de caractères est 100.' });
    maxLength(p.description, 1000, { message: 'Le nombre maximum de caractères est 1000.' });
  });

  ngOnInit(): void {
    if (this.account()) {
      this.accountModel.set(this.account());
    }
  }

  save(): void {
    this.isSaving.set(true);
    const account: IAccount = this.accountModel();
    account.configuration = null;
    if (account.id !== null) {
      this.subscribeToSaveResponse(this.accountService.update(account));
    } else {
      this.subscribeToSaveResponse(this.accountService.create(account));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IAccount>>): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        this.accountService.updateLocalAccount(res.body);
        this.onComplete.emit(res.body);
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: "Une erreur s'est produite.",
        }),
    });
  }
}

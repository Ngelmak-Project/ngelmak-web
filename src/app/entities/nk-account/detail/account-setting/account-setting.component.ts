import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { AlertService } from "app/shared/alert/alert.service";
import SharedModule from "app/shared/shared.module";
import { finalize } from "rxjs";
import { AccountService } from "../../nk-account.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-account-setting",
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./account-setting.component.html",
})
export default class AccountSettingComponent implements OnInit {
  private router = inject(Router);
  accountService = inject(AccountService);
  alertService = inject(AlertService);
  account = inject(AccountService).account;
  isSaving = signal(false);

  accountForm = new FormGroup({
    identifier: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
    }),
    name: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.maxLength(254)],
    }),
  });

  ngOnInit(): void {
    this.accountForm.patchValue(this.account());
  }

  save(): void {
    this.isSaving.set(false);
    const account = { ...this.account(), ...this.accountForm.value };
    const identifierChanged =
      this.account().identifier != this.accountForm.value["identifier"];
    this.accountService
      .update(account)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (result) => {
          this.accountService.updateLocalAccount(result.body);
          this.alertService.addAlert({
            type: "success",
            message:
              "Les informations du compte ont été mises à jour avec succès.",
          });
          if (identifierChanged) {
            this.router.navigate(["nk-account", this.account().identifier]);
          }
        },
        error: () => {
          this.alertService.addAlert({
            type: "error",
            message: "Une erreur s'est produite lors de la mise à jour",
          });
        },
      });
  }
}

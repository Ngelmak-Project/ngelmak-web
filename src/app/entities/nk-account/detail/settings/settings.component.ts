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
  selector: "app-settings",
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./settings.component.html",
})
export default class SettingsComponent implements OnInit {
  private router = inject(Router);
  nkAccountService = inject(AccountService);
  alertService = inject(AlertService);
  nkAccount = inject(AccountService).trackCurrentAccount();
  isSaving = signal(false);

  nkAccountForm = new FormGroup({
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
    this.nkAccountService.currentAccount().subscribe();
    this.nkAccountForm.patchValue(this.nkAccount());
  }

  save(): void {
    this.isSaving.set(false);
    const account = { ...this.nkAccount(), ...this.nkAccountForm.value };
    const identifierChanged =
      this.nkAccount().identifier != this.nkAccountForm.value["identifier"];
    this.nkAccountService
      .partialUpdate(account)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (result) => {
          this.nkAccountService.setNkAccount(result.body);
          this.alertService.addAlert({
            type: "success",
            message:
              "Les informations du compte ont été mises à jour avec succès.",
          });
          if (identifierChanged) {
            this.router.navigate(["nk-account", this.nkAccount().identifier]);
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

import { Component, inject, signal } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AlertService } from "app/shared/alert/alert.service";
import { finalize } from "rxjs";
import { AccountService } from "../nk-account.service";

@Component({
  standalone: true,
  selector: "app-nk-account-detail",
  templateUrl: "./nk-account-detail.component.html",
  imports: [CommonModule, RouterModule],
})
export class AccountDetailComponent {
  alertService = inject(AlertService);
  accountService = inject(AccountService);
  account = inject(AccountService).account;
  isUploading = signal(false);
  editAvatar = signal(false);
  imageSrc = signal(null);
  file: File;

  uploadAvatar() {
    this.isUploading.set(true);
    if (this.file) {
      this.accountService
        .updateAvatar(this.file)
        .pipe(finalize(() => this.isUploading.set(false)))
        .subscribe({
          next: (res) => {
            this.accountService.updateLocalAccount(res.body);
            this.editAvatar.set(false);
            this.imageSrc.set(null);
          },
          error: () =>
            this.alertService.addAlert({
              type: "error",
              message: "Une erreur s'est produite lors de la mise à jour.",
            }),
        });
    }
  }

  handleImage(event) {
    this.editAvatar.set(true);
    this.file = event.target.files[0];
    if (this.file) {
      this.imageSrc.set(URL.createObjectURL(this.file));
    }
  }

  previousState(): void {
    window.history.back();
  }
}

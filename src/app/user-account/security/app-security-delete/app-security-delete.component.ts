import { Component, inject, signal } from '@angular/core';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from 'app/core/auth/auth.model';
import { finalize } from 'rxjs';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  selector: 'app-security-delete',
  imports: [ConfirmDialogComponent],
  templateUrl: './app-security-delete.component.html',
})
export class SecurityDeleteComponent {
  userService = inject(UserService);
  alertService = inject(AlertService);

  deletionDelayDays = 30;
  openDeleteModal = signal(false);
  isDeleting = signal(false);

  deleteUserAccount(confirmation: boolean) {
    if (!confirmation) return;

    this.isDeleting.set(true);
    this.userService
      .delete()
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe({
        next: () => {
          this.alertService.addAlert({
            type: 'success',
            message: 'Confirmation da la suppression de votre compte!',
          });
        },
        error: () => {
          this.alertService.addAlert({
            type: 'error',
            message: "Une erreur s'est produite.",
          });
        },
      });
  }
}

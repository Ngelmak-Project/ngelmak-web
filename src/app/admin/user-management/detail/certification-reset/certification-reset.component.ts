import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certification-reset.component.html',
})
export class CertificationResetComponent {
  // readonly dialogRef = inject(MatDialogRef<CertificationResetComponent>);
  private userService = inject(UserManagementService);
  private alertService = inject(AlertService);

  login: string;
  isSaving = signal(false);

  save() {
    this.isSaving.set(true);
    this.userService.certificationWithdrawal(this.login).subscribe({
      next: (res) => {
        this.alertService.addAlert({
          type: "warning",
          message: `Le compte associé au nom d'utilisateur ${this.login} n'est plus certifié.`,
        });
        // this.dialogRef.close(res.body);
        this.isSaving.set(false);
      },
      error: () => {
        this.alertService.addAlert({
          type: "error",
          message:
            "Une erreur s'est produite.",
        });
        this.isSaving.set(false);
      },
    });
  }
}

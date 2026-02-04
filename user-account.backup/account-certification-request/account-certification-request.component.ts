import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPrivilege } from 'app/entities/models/nk-privilege.model';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-account-certification-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-certification-request.component.html',
})
export class AccountCertificationRequest {
  // readonly dialogRef = inject(MatDialogRef<AccountCertificationRequest>);

  private authService = inject(AuthenticationService);
  private alertService = inject(AlertService);

  privilegeForm = new FormGroup({
    officialDocType: new FormControl(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    officialDocIdentification: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
  });

  login: string;
  privileges: IPrivilege[] = [];
  isSaving = signal(false);

  save() {
    this.isSaving.set(true);
    const request = this.privilegeForm.getRawValue();
    this.authService.requestCertification(request).subscribe({
      next: (account) => {
        this.authService.authenticate(account);
        this.alertService.addAlert({
          type: 'info',
          message: 'Votre requête pour idenfication est prise en compte.',
        });
        // this.dialogRef.close(true);
        this.isSaving.set(false);
      },
      error: () => {
        this.alertService.addAlert({
          type: 'error',
          message: "Une erreur s'est produite.",
        });
        this.isSaving.set(false);
      },
    });
  }
}

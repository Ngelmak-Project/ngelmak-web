import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service';
import { IPrivilege } from 'app/entities/models/nk-privilege.model';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certification.component.html',
})
export class CertificationComponent implements OnInit {
  // readonly dialogRef = inject(MatDialogRef<CertificationComponent>);
  private userService = inject(UserManagementService);
  private alertService = inject(AlertService);

  privilegeForm = new FormGroup({
    officialDocType: new FormControl(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    officialDocIdentification: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(20),
      ],
    }),
  });

  login: string;
  privileges: IPrivilege[] = [];
  isSaving = signal(false);

  ngOnInit(): void {
    this.userService.getAuthenticationCertification(this.login).subscribe(res => (this.privilegeForm.patchValue(res.body)));
  }

  save() {
    this.isSaving.set(true);
    const request = this.privilegeForm.getRawValue();
    this.userService.certificate(request).subscribe({
      next: (res) => {
        this.alertService.addAlert({
          type: "info",
          message: "Votre requête pour idenfication est prise en compte.",
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

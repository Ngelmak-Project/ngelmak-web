import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { UserManagementService } from 'app/admin/user-management/user-management.service';
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

  certificationModel = signal({
    id: null,
    docType: null,
    docIdentification: '',
  });

  certificationForm = form(this.certificationModel, (p) => ({
    docType: [p.docType, [Validators.required]],
    docIdentification: [p.docIdentification, [Validators.required, Validators.maxLength(20)]],
  }));

  isSaving = signal(false);

  ngOnInit(): void {
    // this.userService.getAuthenticationCertification(this.login).subscribe(res => (this.privilegeForm.patchValue(res.body)));
  }

  save() {
    this.isSaving.set(true);
    const { id, docType, docIdentification } = this.certificationModel();
    this.userService.certificate(id, docType, docIdentification).subscribe({
      next: (res) => {
        this.alertService.addAlert({
          type: 'info',
          translationKey: '',
          message: 'Votre requête pour idenfication est prise en compte.',
        });
      },
      error: () => {
        this.alertService.addAlert({
          type: 'error',
          translationKey: '',
          message: "Une erreur s'est produite.",
        });
      },
    });
  }
}

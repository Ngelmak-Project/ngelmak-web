import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from 'app/shared/alert/alert.service';

import { CommonModule } from '@angular/common';
import { IPrivilege } from 'app/entities/models/nk-privilege.model';

@Component({
  standalone: true,
  selector: 'app-privilege-grant',
  templateUrl: './privilege-grant.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class PrivilegeGrantComponent {
  // readonly dialogRef = inject(MatDialogRef<PrivilegeGrantComponent>);

  private alertService = inject(AlertService);

  privilegeForm = new FormGroup({
    privilege: new FormControl(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    comment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
    }),
  });

  login: string;
  privileges: IPrivilege[] = [];
  isSaving = signal(false);

  constructor() {}

  save() {}
}

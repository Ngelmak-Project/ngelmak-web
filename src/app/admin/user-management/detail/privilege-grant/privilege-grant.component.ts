import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AlertService } from "app/shared/alert/alert.service";

import { CommonModule } from "@angular/common";
import { IPrivilege } from "app/entities/models/nk-privilege.model";
import { PrivilegeService } from "app/entities/nk-privilege/service/nk-privilege.service";

@Component({
  standalone: true,
  selector: "app-privilege-grant",
  templateUrl: "./privilege-grant.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class PrivilegeGrantComponent {
  // readonly dialogRef = inject(MatDialogRef<PrivilegeGrantComponent>);

  private privilegeService = inject(PrivilegeService);
  private alertService = inject(AlertService);

  privilegeForm = new FormGroup({
    privilege: new FormControl(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    comment: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    }),
  });

  login: string;
  privileges: IPrivilege[] = [];
  isSaving = signal(false);

  constructor() {
    this.privilegeService
      .query()
      .subscribe((res) => (this.privileges = res.body));
  }

  save() {
    this.isSaving.set(true);

    this.privilegeService
      .grant({
        login: this.login,
        comment: this.privilegeForm.value.comment,
        privilege: this.privilegeForm.value.privilege,
      })
      .subscribe({
        next: () => {
          this.alertService.addAlert({
            type: "success",
            message: "Privilège attribuée avec succès !",
          });
          // this.dialogRef.close();
          this.isSaving.set(false);
        },
        error: () => {
          this.alertService.addAlert({
            type: "error",
            message:
              "Une erreur s'est produite lors de l'attribution du privilège.",
          });
          this.isSaving.set(false);
        },
      });
  }
}

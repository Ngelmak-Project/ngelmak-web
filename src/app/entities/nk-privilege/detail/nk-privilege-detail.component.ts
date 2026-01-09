import { Component, signal } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import SharedModule from "app/shared/shared.module";
import dayjs from "dayjs/esm";

@Component({
  standalone: true,
  selector: "app-privilege-detail",
  templateUrl: "./nk-privilege-detail.component.html",
  imports: [
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ],
})
export class PrivilegeDetailComponent {
  isSaving = signal(false);
  isEditing = signal(true);

  privilegeForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(
      null,
      Validators.required
    ),
    createdAt: new FormControl<dayjs.Dayjs | null>(
      null
    ),
    description: new FormControl<string | null>(
      null,
      [Validators.required, Validators.min(20), Validators.maxLength(200)]
    ),
  });

  save() {

  }
}

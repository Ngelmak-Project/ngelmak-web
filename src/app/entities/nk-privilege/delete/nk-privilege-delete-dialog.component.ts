import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PrivilegeService } from "app/entities/nk-privilege/service/nk-privilege.service";
;

import SharedModule from "app/shared/shared.module";

import { IPrivilege } from "app/entities/models/nk-privilege.model";

@Component({
  standalone: true,
  templateUrl: "./nk-privilege-delete-dialog.component.html",
  imports: [SharedModule, FormsModule],
})
export class PrivilegeDeleteDialogComponent {
  privilege?: IPrivilege;

  protected privilegeService = inject(PrivilegeService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    // this.privilegeService.delete(id).subscribe(() => {

    // });
  }
}

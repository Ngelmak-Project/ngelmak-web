import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';
import { UserManagementService } from '../service/user-management.service';
import { Authentication } from 'app/core/auth/auth.model';

@Component({
  standalone: true,
  selector: 'app-user-mgmt-delete-dialog',
  templateUrl: './user-management-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class UserManagementDeleteDialogComponent {
  user?: Authentication;

  private userService = inject(UserManagementService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(login: string): void {
    this.userService.delete(login).subscribe(() => {
      // this.activeModal.close('deleted');
    });
  }
}

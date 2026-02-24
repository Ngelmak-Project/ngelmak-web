import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

@Component({
  standalone: true,
  templateUrl: './authority-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AuthorityDeleteDialogComponent {
  authority?: IAuthority;

  protected authorityService = inject(AuthorityService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.authorityService.delete(id).subscribe(() => {

    });
  }
}

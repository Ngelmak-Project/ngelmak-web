import { UserManagementService } from 'app/admin/user-management/user-management.service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { IContactMessage } from 'app/admin/user-management/user-management.model';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { finalize } from 'rxjs';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  selector: 'app-open-message',
  templateUrl: './open-message.component.html',
  imports: [CommonModule, FormatMediumDatetimePipe],
  animations: [fadeInUp400ms],
})
export class OpenMessageComponent {
  message = input.required<IContactMessage>();
  onclose = output<IContactMessage | null>();

  userManagementService = inject(UserManagementService);
  alertSevice = inject(AlertService);

  isSaving = signal(false);

  close() {
    this.isSaving.set(true);
    this.userManagementService
      .closeContact(this.message().id)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.alertSevice.addAlert({
            type: 'success',
            message: 'Le message est clôturé.',
          });
          this.onclose.emit(body); // Emit the newly updated operation.
        },
        error: () => {
          this.alertSevice.addAlert({
            type: 'error',
            message: "Une erreur est survenue pendant l'opération",
          });
        },
      });
  }
}

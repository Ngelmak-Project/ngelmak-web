import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { ApiError } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-security-email',
  imports: [CommonModule, Field, SharedModule],
  templateUrl: './app-security-email.component.html',
})
export class SecurityEmailComponent {
  user = inject(AuthenticationService).authentication;
  authenticationService = inject(AuthenticationService);
  alertService = inject(AlertService);
  userService = inject(UserService);

  emailModel = signal({
    email: '',
  });
  emailForm = form(this.emailModel);

  editEmail = signal(false);
  isUpdating = signal(false);
  loginAlreadyInUse = signal(false);
  errorEmailExists = signal(false);

  constructor() {
    console.log(this.user());
  }

  updateEmail() {
    this.isUpdating.set(true);
    const value = this.emailModel();
    this.userService
      .updateEmail(value)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.editEmail.set(false);
          // Update user profil info.
          this.authenticationService.authenticate(body);
          this.alertService.addAlert({
            type: 'success',
            message: 'Votre email est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'emailExists') {
            this.alertService.addAlert({
              type: 'error',
              message: "L'adresse e-mail est déjà utilisée !.",
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

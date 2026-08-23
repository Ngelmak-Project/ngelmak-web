import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { email, Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { ApiError } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-security-email',
  templateUrl: './app-security-email.component.html',
  imports: [CommonModule, Field, SharedModule],
})
export class SecurityEmailComponent {
  user = inject(AuthenticationService).authentication;
  authenticationService = inject(AuthenticationService);
  alertService = inject(AlertService);
  userService = inject(UserService);

  emailModel = signal({ email: '' });
  emailForm = form(this.emailModel, (p) => {
    email(p.email, { message: 'ngelmakTranslation.userManagement.security.email.form.email' });
    required(p.email, {
      message: 'ngelmakTranslation.userManagement.security.email.form.required',
    });
    minLength(p.email, 5, {
      message: 'ngelmakTranslation.userManagement.security.email.form.minLength',
    });
    maxLength(p.email, 254, {
      message: 'ngelmakTranslation.userManagement.security.email.form.maxLength',
    });
  });

  isEditing = signal(false);
  isSaving = signal(false);
  loginAlreadyInUse = signal(false);
  errorEmailExists = signal(false);

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.emailModel.set({ email: this.user().email });
      }
    });
  }

  updateEmail() {
    this.isSaving.set(true);
    const value = this.emailModel();
    this.userService
      .updateEmail(value)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.isEditing.set(false);
          // Update user profil info.
          this.authenticationService.setAuthentication(body);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.userManagement.security.email.alerts.updateSuccess',
            message: 'Votre email est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'emailExists') {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.userManagement.security.email.alerts.emailExists',
              message: "L'adresse e-mail est déjà utilisée !.",
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.userManagement.security.email.alerts.updateError',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

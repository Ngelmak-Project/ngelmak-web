import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { ApiError } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-security-login',
  templateUrl: './app-security-login.component.html',
  imports: [CommonModule, Field, SharedModule],
})
export class SecurityLoginComponent {
  user = inject(AuthenticationService).authentication;
  authenticationService = inject(AuthenticationService);
  alertService = inject(AlertService);
  userService = inject(UserService);

  loginModel = signal({ login: '' });
  loginForm = form(this.loginModel, (p) => {
    minLength(p.login, 4, {
      message: 'ngelmakTranslation.userManagement.security.login.form.minLength',
    });
    maxLength(p.login, 50, {
      message: 'ngelmakTranslation.userManagement.security.login.form.maxLength',
    });
    required(p.login, {
      message: 'ngelmakTranslation.userManagement.security.login.form.required',
    });
  });

  isEditing = signal(false);
  isSaving = signal(false);
  loginAlreadyInUse = signal(false);

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.loginModel.set({ login: this.user().login });
      }
    });
  }

  updateLogin() {
    this.isSaving.set(true);
    const value = this.loginModel();
    this.userService
      .updateLogin(value)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.isEditing.set(false);
          // Update user profil info.
          this.authenticationService.authenticate(body);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.userManagement.security.login.alerts.updateSuccess',
            message: 'Votre login est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'loginExists') {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.userManagement.security.login.alerts.loginExists',
              message: "L'adresse e-mail est déjà utilisée !.",
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.userManagement.security.login.alerts.updateError',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

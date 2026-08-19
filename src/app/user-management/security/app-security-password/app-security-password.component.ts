import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { PasswordStrengthBarComponent } from 'app/authentication/sign-up/password-strength-bar/password-strength-bar.component';
import { ApiError } from 'app/core/auth/auth.model';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { UserService } from '../user.service';

const initPassword = {
  currentPassword: '',
  confirmPassword: '',
  newPassword: '',
};

@Component({
  selector: 'app-security-password',
  templateUrl: './app-security-password.component.html',
  imports: [CommonModule, Field, PasswordStrengthBarComponent, SharedModule],
})
export class SecurityPasswordComponent {
  protected userService = inject(UserService);
  protected alertService = inject(AlertService);

  passwordModel = signal(initPassword);

  passwordForm = form(this.passwordModel, (p) => {
    // Current password
    required(p.currentPassword, {
      message: 'ngelmakTranslation.userManagement.security.password.form.required',
    });
    minLength(p.currentPassword, 8, {
      message: 'ngelmakTranslation.userManagement.security.password.form.minLength',
    });
    maxLength(p.currentPassword, 20, {
      message: 'ngelmakTranslation.userManagement.security.password.form.maxLength',
    });

    // New password
    required(p.newPassword, {
      message: 'ngelmakTranslation.userManagement.security.password.form.required',
    });
    minLength(p.newPassword, 8, {
      message: 'ngelmakTranslation.userManagement.security.password.form.minLength',
    });
    maxLength(p.newPassword, 20, {
      message: 'ngelmakTranslation.userManagement.security.password.form.maxLength',
    });

    // Confirm password
    required(p.confirmPassword, {
      message: 'ngelmakTranslation.userManagement.security.password.form.required',
    });
    minLength(p.confirmPassword, 8, {
      message: 'ngelmakTranslation.userManagement.security.password.form.minLength',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'ngelmakTranslation.userManagement.security.password.form.maxLength',
    });
  });

  doNotMatch = signal(false);
  isSaving = signal(false);
  showPassword = signal(false);
  isEditing = signal(false);

  constructor() {
    effect(() => {
      if (this.passwordForm.confirmPassword().dirty()) {
        const match = this.passwordModel().newPassword !== this.passwordModel().confirmPassword;
        this.doNotMatch.set(match);
      }
    });
  }

  updatePassword() {
    this.isSaving.set(true);
    const value = this.passwordModel();
    this.userService
      .changePassword(value)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.isEditing.set(false);
          this.passwordForm().reset(initPassword);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.userManagement.security.password.alerts.success',
            message: 'Votre mot de passe est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'invalidPassword') {
            this.alertService.addAlert({
              type: 'error',
              translationKey:
                'ngelmakTranslation.userManagement.security.password.alerts.invalidCurrentPassword',
              message: 'Le mot de passe actuel ne correspond pas.',
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.userManagement.security.password.alerts.error',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

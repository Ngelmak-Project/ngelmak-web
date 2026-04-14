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
  imports: [CommonModule, Field, PasswordStrengthBarComponent, SharedModule],
  templateUrl: './app-security-password.component.html',
})
export class SecurityPasswordComponent {
  protected userService = inject(UserService);
  protected alertService = inject(AlertService);

  passwordModel = signal(initPassword);
  editPassword = signal(false);

  passwordForm = form(this.passwordModel, (p) => {
    // Current password
    required(p.currentPassword, { message: 'Current password is required.' });
    minLength(p.currentPassword, 8, {
      message: 'Current password must be at least 8 characters long.',
    });
    maxLength(p.currentPassword, 20, { message: 'Current password cannot exceed 20 characters.' });

    // Confirm password
    required(p.confirmPassword, { message: 'Password confirmation is required.' });
    minLength(p.confirmPassword, 8, {
      message: 'Password confirmation must be at least 8 characters long.',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'Password confirmation cannot exceed 20 characters.',
    });

    // New password
    required(p.newPassword, { message: 'New password is required.' });
    minLength(p.newPassword, 8, { message: 'New password must be at least 8 characters long.' });
    maxLength(p.newPassword, 20, { message: 'New password cannot exceed 20 characters.' });
  });

  doNotMatch = signal(false);
  isUpdating = signal(false);
  showPassword = signal(false);

  constructor() {
    effect(() => {
      if (this.passwordForm.confirmPassword().dirty()) {
        const match = this.passwordModel().newPassword !== this.passwordModel().confirmPassword;
        this.doNotMatch.set(match);
      }
    });
  }

  updatePassword() {
    this.isUpdating.set(true);
    const value = this.passwordModel();
    this.userService
      .changePassword(value)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm().reset(initPassword);
          this.alertService.addAlert({
            type: 'success',
            message: 'Votre mot de passe est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'invalidPassword') {
            this.alertService.addAlert({
              type: 'error',
              message: 'Le mot de passe actuel ne correspond pas.',
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

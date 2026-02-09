import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { PasswordStrengthBarComponent } from 'app/authentication/sign-up/password-strength-bar/password-strength-bar.component';
import { finalize } from 'rxjs';
import { UserService } from '../user.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from 'app/core/auth/auth.model';

const initPassword = {
  currentPassword: '',
  confirmPassword: '',
  newPassword: '',
};

@Component({
  selector: 'app-security-password',
  imports: [CommonModule, Field, PasswordStrengthBarComponent],
  templateUrl: './app-security-password.component.html',
})
export class SecurityPasswordComponent {
  protected userService = inject(UserService);
  protected alertService = inject(AlertService);

  passwordModel = signal(initPassword);

  passwordForm = form(this.passwordModel, (p) => {
    required(p.currentPassword, { message: '' });
    minLength(p.currentPassword, 4, { message: '' });
    maxLength(p.currentPassword, 20, { message: '' });
    required(p.confirmPassword, { message: '' });
    minLength(p.confirmPassword, 4, { message: '' });
    maxLength(p.confirmPassword, 20, { message: '' });
    required(p.newPassword, { message: '' });
    minLength(p.newPassword, 4, { message: '' });
    maxLength(p.newPassword, 20, { message: '' });
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

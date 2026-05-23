import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiError } from 'app/core/auth/auth.model';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { PasswordStrengthBarComponent } from '../sign-up/password-strength-bar/password-strength-bar.component';
import { ResetPasswordService } from './reset-password.service';
import { LanguageSwitcherComponent } from 'app/shared/language-switcher/language-switcher.component';

const initPassword = {
  key: '',
  confirmPassword: '',
  newPassword: '',
};

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    CommonModule,
    RouterModule,
    Field,
    PasswordStrengthBarComponent,
    SharedModule,
    LanguageSwitcherComponent,
  ],
})
export class ResetPasswordComponent {
  protected resetPasswordService = inject(ResetPasswordService);
  protected alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  passwordModel = signal(initPassword);

  passwordForm = form(this.passwordModel, (p) => {
    // Key field validation
    required(p.key, { message: 'ngelmakTranslation.auth.resetPassword.key.required' });
    minLength(p.key, 4, {
      message: 'ngelmakTranslation.auth.resetPassword.key.minLength',
    });
    maxLength(p.key, 20, {
      message: 'ngelmakTranslation.auth.resetPassword.key.maxLength',
    });

    // New password
    required(p.newPassword, {
      message: 'ngelmakTranslation.auth.resetPassword.password.newPasswordLabel',
    });
    minLength(p.newPassword, 8, {
      message: 'ngelmakTranslation.auth.resetPassword.password.minLength',
    });
    maxLength(p.newPassword, 20, {
      message: 'ngelmakTranslation.auth.resetPassword.password.maxLength',
    });

    // Confirm password
    required(p.confirmPassword, {
      message: 'ngelmakTranslation.auth.resetPassword.password.confirmPasswordLabel',
    });
    minLength(p.confirmPassword, 8, {
      message: 'ngelmakTranslation.auth.resetPassword.password.minLength',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'ngelmakTranslation.auth.resetPassword.password.maxLength',
    });
  });

  doNotMatch = signal(false);
  isUpdating = signal(false);
  showPassword = signal(false);

  key = this.route.snapshot.queryParamMap.get('key') ?? '';
  keyIsPresent = signal(this.key.length > 0);

  constructor() {
    this.passwordModel.update((model) => ({ ...model, key: this.key }));
    // Set presence flag
    this.keyIsPresent.set(this.key.length > 0);
    effect(() => {
      if (this.passwordForm.confirmPassword().dirty()) {
        const match = this.passwordModel().newPassword !== this.passwordModel().confirmPassword;
        this.doNotMatch.set(match);
      }
    });
  }

  resetPassword() {
    this.isUpdating.set(true);
    const { key, newPassword } = this.passwordModel();
    this.resetPasswordService
      .updatePasswor(key, newPassword)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm().reset(initPassword);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.auth.resetPassword.alerts.success',
            message: 'Votre mot de passe est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'userNotFound') {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.resetPassword.alerts.invalidKey',
              message: 'La clé fournie est invalide ou expirée.',
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.resetPassword.alerts.error',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

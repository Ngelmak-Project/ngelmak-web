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
import { PasswordResetService } from './password-reset.service';
import { PreferencesPanelComponent } from 'app/shared/preferences-panel/preferences-panel.component';

const initPassword = {
  key: '',
  confirmPassword: '',
  newPassword: '',
};

@Component({
  standalone: true,
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  imports: [
    CommonModule,
    RouterModule,
    Field,
    PasswordStrengthBarComponent,
    SharedModule,
    PreferencesPanelComponent,
  ],
})
export class PasswordResetComponent {
  protected PasswordResetService = inject(PasswordResetService);
  protected alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  passwordModel = signal(initPassword);

  passwordForm = form(this.passwordModel, (p) => {
    // Key field validation
    required(p.key, { message: 'ngelmakTranslation.auth.PasswordReset.key.required' });
    minLength(p.key, 4, {
      message: 'ngelmakTranslation.auth.PasswordReset.key.minLength',
    });
    maxLength(p.key, 20, {
      message: 'ngelmakTranslation.auth.PasswordReset.key.maxLength',
    });

    // New password
    required(p.newPassword, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.newPasswordLabel',
    });
    minLength(p.newPassword, 8, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.minLength',
    });
    maxLength(p.newPassword, 20, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.maxLength',
    });

    // Confirm password
    required(p.confirmPassword, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.confirmPasswordLabel',
    });
    minLength(p.confirmPassword, 8, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.minLength',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'ngelmakTranslation.auth.PasswordReset.password.maxLength',
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

  PasswordReset() {
    this.isUpdating.set(true);
    const { key, newPassword } = this.passwordModel();
    this.PasswordResetService
      .updatePasswor(key, newPassword)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm().reset(initPassword);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.auth.PasswordReset.alerts.success',
            message: 'Votre mot de passe est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'userNotFound') {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.PasswordReset.alerts.invalidKey',
              message: 'La clé fournie est invalide ou expirée.',
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.PasswordReset.alerts.error',
              message: "Une erreur s'est produite.",
            });
          }
        },
      });
  }
}

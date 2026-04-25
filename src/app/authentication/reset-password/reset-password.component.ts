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
import { LanguageSwitcherComponent } from "app/shared/language-switcher/language-switcher.component";

const initPassword = {
  key: '',
  confirmPassword: '',
  newPassword: '',
};

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [CommonModule, RouterModule, Field, PasswordStrengthBarComponent, SharedModule, LanguageSwitcherComponent],
})
export class ResetPasswordComponent {
  protected resetPasswordService = inject(ResetPasswordService);
  protected alertService = inject(AlertService);
  private route = inject(ActivatedRoute);

  passwordModel = signal(initPassword);

  passwordForm = form(this.passwordModel, (p) => {
    // Key field validation
    required(p.key, { message: 'La clé est requise.' });
    minLength(p.key, 4, {
      message: 'La clé doit contenir au moins 4 caractères.',
    });
    maxLength(p.key, 20, {
      message: 'La clé ne peut pas dépasser 20 caractères.',
    });

    // New password
    required(p.newPassword, { message: 'Le nouveau mot de passe est requis.' });
    minLength(p.newPassword, 8, {
      message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
    });
    maxLength(p.newPassword, 20, {
      message: 'Le nouveau mot de passe ne peut pas dépasser 20 caractères.',
    });

    // Confirm password
    required(p.confirmPassword, { message: 'La confirmation du mot de passe est requise.' });
    minLength(p.confirmPassword, 8, {
      message: 'La confirmation du mot de passe doit contenir au moins 8 caractères.',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'La confirmation du mot de passe ne peut pas dépasser 20 caractères.',
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
            message: 'Votre mot de passe est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'userNotFound') {
            this.alertService.addAlert({
              type: 'error',
              message: 'La clé fournie est invalide ou expirée.',
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

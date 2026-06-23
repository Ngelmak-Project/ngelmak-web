import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import {
  email,
  Field,
  form,
  maxLength,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { ApiError } from 'app/core/auth/auth.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { LanguageSwitcherComponent } from 'app/shared/language-switcher/language-switcher.component';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { TranslationService } from './../../shared/translation/translation.service';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { SignupModel } from './sign-up.model';
import { SignUpService } from './sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    CommonModule,
    RouterModule,
    Field,
    PasswordStrengthBarComponent,
    SharedModule,
    LanguageSwitcherComponent,
  ],
})
export class SignUpComponent {
  private langKey = inject(TranslationService).lang;
  private registerService = inject(SignUpService);
  private route = inject(Router);
  private alertService = inject(AlertService);

  // $2a$10$Ruqb0Q5NYwtK3SynZT8NYejh76iitDLodyeUovNwbcTgeh.n0NaO2
  doNotMatch = signal(false);
  showPassword = signal(false);
  error = signal(false);
  errorEmailExists = signal(false);
  errorUserExists = signal(false);
  isRegistering = signal(false);

  signupModel = signal<SignupModel>({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    langKey: 'fr',
  });

  signupForm = form(this.signupModel, (p) => {
    // Login
    required(p.login, { message: 'ngelmakTranslation.auth.signUp.login.required' });
    minLength(p.login, 4, { message: 'ngelmakTranslation.auth.signUp.login.minLength' });
    maxLength(p.login, 50, { message: 'ngelmakTranslation.auth.signUp.login.maxLength' });
    pattern(
      p.login,
      /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
      { message: 'ngelmakTranslation.auth.signUp.login.pattern' },
    );

    // Email
    required(p.email, { message: 'ngelmakTranslation.auth.signUp.email.required' });
    minLength(p.email, 4, { message: 'ngelmakTranslation.auth.signUp.email.minLength' });
    maxLength(p.email, 254, { message: 'ngelmakTranslation.auth.signUp.email.maxLength' });
    email(p.email, { message: 'ngelmakTranslation.auth.signUp.email.invalid' });

    // Password
    required(p.password, { message: 'ngelmakTranslation.auth.signUp.password.required' });
    minLength(p.password, 8, { message: 'ngelmakTranslation.auth.signUp.password.minLength' });
    maxLength(p.password, 20, { message: 'ngelmakTranslation.auth.signUp.password.maxLength' });

    // Password confirmation
    required(p.confirmPassword, {
      message: 'ngelmakTranslation.auth.signUp.confirmPassword.required',
    });
    minLength(p.confirmPassword, 8, {
      message: 'ngelmakTranslation.auth.signUp.confirmPassword.minLength',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'ngelmakTranslation.auth.signUp.confirmPassword.maxLength',
    });
  });

  constructor() {
    effect(() => {
      if (this.signupForm.confirmPassword().dirty()) {
        const match = this.signupModel().password !== this.signupModel().confirmPassword;
        this.doNotMatch.set(match);
      }
    });
  }

  register(): void {
    this.isRegistering.set(true);
    this.errorEmailExists.set(false);
    this.errorUserExists.set(false);
    const value = this.signupModel();
    value.langKey = this.langKey(); // Update user language preference.
    this.registerService
      .save(value)
      .pipe(finalize(() => this.isRegistering.set(false)))
      .subscribe({
        next: () => {
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.auth.signUp.alerts.success',
            message: 'Bienvenue à Ngelmak !',
          });
          this.route.navigate(['']); // return to home
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'loginExists') {
            this.errorUserExists.set(true);
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.signUp.alerts.loginExists',
              message: "Ce nom d'utilisateur est déjà utilisé",
            });
          } else if (apiError.errorKey === 'emailExists') {
            this.errorEmailExists.set(true);
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.signUp.alerts.emailExists',
              message: 'Cette adresse email est déjà utilisée',
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.signUp.alerts.error',
              message: 'Une erreur est survenue lors de linscription',
            });
          }
        },
      });
  }
}

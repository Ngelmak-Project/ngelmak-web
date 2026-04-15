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
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { SignupModel } from './sign-up.model';
import { SignUpService } from './sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [CommonModule, RouterModule, Field, PasswordStrengthBarComponent, SharedModule],
})
export class SignUpComponent {
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
    required(p.login, { message: "Le nom d'utilisateur est obligatoire." });
    minLength(p.login, 4, { message: "Le nom d'utilisateur doit contenir au moins 4 caractères." });
    maxLength(p.login, 50, { message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères." });
    pattern(
      p.login,
      /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
      { message: "Le nom d'utilisateur n'a pas un format valide." },
    );

    // Email
    required(p.email, { message: "L'adresse e-mail est obligatoire." });
    minLength(p.email, 4, { message: "L'adresse e-mail doit contenir au moins 4 caractères." });
    maxLength(p.email, 254, { message: "L'adresse e-mail ne peut pas dépasser 254 caractères." });
    email(p.email, { message: "L'adresse e-mail n'est pas valide." });

    // Password
    required(p.password, { message: 'Le mot de passe est obligatoire.' });
    minLength(p.password, 8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    maxLength(p.password, 20, { message: 'Le mot de passe ne peut pas dépasser 20 caractères.' });

    // Password confirmation
    required(p.confirmPassword, { message: 'La confirmation du mot de passe est obligatoire.' });
    minLength(p.confirmPassword, 8, {
      message: 'La confirmation doit contenir au moins 8 caractères.',
    });
    maxLength(p.confirmPassword, 20, {
      message: 'La confirmation ne peut pas dépasser 20 caractères.',
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
    this.registerService
      .save(value)
      .pipe(finalize(() => this.isRegistering.set(false)))
      .subscribe({
        next: () => {
          this.alertService.addAlert({ type: 'success', message: 'Bienvenue à Ngelmak !' });
          this.route.navigate(['']); // return to home
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'loginExists') {
            this.errorUserExists.set(true);
            this.alertService.addAlert({
              type: 'error',
              message: "Ce nom d'utilisateur est déjà utilisé",
            });
          } else if (apiError.errorKey === 'emailExists') {
            this.errorEmailExists.set(true);
            this.alertService.addAlert({
              type: 'error',
              message: 'Cette adresse email est déjà utilisée',
            });
          } else {
            this.alertService.addAlert({
              type: 'error',
              message: 'Une erreur est survenue lors de linscription',
            });
          }
        },
      });
  }
}

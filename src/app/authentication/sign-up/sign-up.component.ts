import { AlertService } from 'app/shared/alert/alert.service';
import { CommonModule } from '@angular/common';
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
import { SignupModel } from './sign-up.model';
import { SignUpService } from './sign-up.service';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [RouterModule, CommonModule, Field, PasswordStrengthBarComponent],
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
    firstname: '',
    lastname: '',
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    langKey: 'fr',
  });

  signupForm = form(this.signupModel, (p) => {
    required(p.login, { message: '' });
    minLength(p.login, 4, { message: '' });
    maxLength(p.login, 50, { message: '' });
    pattern(
      p.login,
      /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
      { message: '' },
    );
    required(p.email, { message: '' });
    minLength(p.email, 4, { message: '' });
    maxLength(p.email, 254, { message: '' });
    email(p.email, { message: '' });
    required(p.password, { message: '' });
    minLength(p.password, 4, { message: '' });
    maxLength(p.password, 20, { message: '' });
    required(p.confirmPassword, { message: '' });
    minLength(p.confirmPassword, 4, { message: '' });
    maxLength(p.confirmPassword, 20, { message: '' });
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
    this.error.set(false);
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
        error: (response) => {
          if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists.set(true);
          } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from "app/core/auth/auth.service";
import SharedModule from 'app/shared/shared.module';
import PasswordStrengthBarComponent from './password-strength-bar/password-strength-bar.component';
import { PasswordService } from './password.service';
;

@Component({
  standalone: true,
  selector: 'app-password',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent],
  templateUrl: './password.component.html',
})
export default class PasswordComponent implements OnInit {
  doNotMatch = signal(false);
  error = signal(false);
  success = signal(false);
  account$?: Observable<Authentication | null>;
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  private passwordService = inject(PasswordService);
  private accountService = inject(AuthenticationService);

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.error.set(false);
    this.success.set(false);
    this.doNotMatch.set(false);

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.doNotMatch.set(true);
    } else {
      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => this.success.set(true),
        error: () => this.error.set(true),
      });
    }
  }
}

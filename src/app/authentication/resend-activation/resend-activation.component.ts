import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Field, email, form, maxLength, minLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { ApiError } from 'app/core/auth/auth.model';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { ForgetPasswordService } from './resend-activation.service';
import { LanguageSwitcherComponent } from "app/shared/language-switcher/language-switcher.component";

@Component({
  standalone: true,
  selector: 'app-resend-activation',
  templateUrl: './resend-activation.component.html',
  imports: [CommonModule, RouterModule, Field, SharedModule, LanguageSwitcherComponent],
})
export class ResendActivationComponent {
  private forgetPasswordService = inject(ForgetPasswordService);

  protected emailModel = signal<{ email?: string }>({
    email: '',
  });

  protected emailForm = form(this.emailModel, (p) => {
    required(p.email, { message: 'ngelmakTranslation.auth.resendActivation.email.required' });
    minLength(p.email, 5, { message: 'ngelmakTranslation.auth.resendActivation.email.minLength' });
    maxLength(p.email, 254, { message: 'ngelmakTranslation.auth.resendActivation.email.maxLength' });
    email(p.email, { message: 'ngelmakTranslation.auth.resendActivation.email.email' });
  });

  isResetting = signal(false);
  alreadyActivated = signal(false);
  success = signal(false);
  error = signal(false);

  resendActivation() {
    this.isResetting.set(true);
    const { email } = this.emailModel();
    this.forgetPasswordService
      .resendActivation(email)
      .pipe(finalize(() => this.isResetting.set(false)))
      .subscribe({
        next: () => this.success.set(true),
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'userAlreadyActivated') {
            this.alreadyActivated.set(true);
          } else if (apiError.status === 500) this.error.set(true);
        },
      });
  }
}

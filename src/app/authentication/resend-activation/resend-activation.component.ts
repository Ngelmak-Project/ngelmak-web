import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Field, email, form, maxLength, minLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { ApiError } from 'app/core/auth/auth.model';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { ForgetPasswordService } from './resend-activation.service';

@Component({
  standalone: true,
  selector: 'app-resend-activation',
  templateUrl: './resend-activation.component.html',
  imports: [CommonModule, RouterModule, Field, SharedModule],
})
export class ResendActivationComponent {
  private forgetPasswordService = inject(ForgetPasswordService);

  protected emailModel = signal<{ email?: string }>({
    email: '',
  });

  protected emailForm = form(this.emailModel, (p) => {
    required(p.email, { message: "L'adresse e-mail est obligatoire." });
    minLength(p.email, 4, { message: "L'adresse e-mail doit contenir au moins 4 caractères." });
    maxLength(p.email, 254, { message: "L'adresse e-mail ne peut pas dépasser 254 caractères." });
    email(p.email, { message: "L'adresse e-mail n'est pas valide." });
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
          if (apiError.errorKey === 'userAlreadyActivated') {
            this.alreadyActivated.set(true);
          } else if (apiError.status === 500) this.error.set(true);
        },
      });
  }
}

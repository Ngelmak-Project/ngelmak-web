import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Field, email, form, maxLength, minLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { ApiError } from 'app/core/auth/auth.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize } from 'rxjs';
import { ForgetPasswordService } from './forgot-password.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [CommonModule, RouterModule, Field],
})
export class ForgotPasswordComponent {
  private forgetPasswordService = inject(ForgetPasswordService);
  private alertService = inject(AlertService);

  isResetting = signal(false);

  protected resetModel = signal<{ email?: string }>({
    email: '',
  });

  protected resetForm = form(this.resetModel, (p) => {
    required(p.email, { message: "L'adresse e-mail est obligatoire." });
    minLength(p.email, 4, { message: "L'adresse e-mail doit contenir au moins 4 caractères." });
    maxLength(p.email, 254, { message: "L'adresse e-mail ne peut pas dépasser 254 caractères." });
    email(p.email, { message: "L'adresse e-mail n'est pas valide." });
  });

  reset() {
    this.isResetting.set(true);
    const { email } = this.resetModel();
    this.forgetPasswordService
      .passwordReset(email)
      .pipe(finalize(() => this.isResetting.set(false)))
      .subscribe({
        next: () =>
          this.alertService.addAlert({
            type: 'info',
            message:
              'Si cette adresse est liée à un compte, un email de réinitialisation vous sera transmis.',
          }),
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.status === 500)
            this.alertService.addAlert({
              type: 'error',
              message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
            });
        },
      });
  }
}

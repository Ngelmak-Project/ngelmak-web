import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { ApiError } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize, share } from 'rxjs';
import { UserService } from '../user.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-security-login',
  imports: [CommonModule, Field, SharedModule],
  templateUrl: './app-security-login.component.html',
})
export class SecurityLoginComponent {
  user = inject(AuthenticationService).authentication;
  authenticationService = inject(AuthenticationService);
  alertService = inject(AlertService);
  userService = inject(UserService);

  loginModel = signal({
    login: '',
  });
  loginForm = form(this.loginModel);

  editLogin = signal(false);
  isUpdating = signal(false);
  loginAlreadyInUse = signal(false);

  updateLogin() {
    this.isUpdating.set(true);
    const value = this.loginModel();
    this.userService
      .updateLogin(value)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.editLogin.set(false);
          // Update user profil info.
          this.authenticationService.authenticate(body);
          this.alertService.addAlert({
            type: 'success',
            message: 'Votre login est mis à jour avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError.errorKey === 'loginExists') {
            this.alertService.addAlert({
              type: 'error',
              message: "L'adresse e-mail est déjà utilisée !.",
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

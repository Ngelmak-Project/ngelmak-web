import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { SignInModel } from 'app/authentication/sign-in/sign-in.model';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { ApiError } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { PreferencesPanelComponent } from 'app/shared/preferences-panel/preferences-panel.component';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [RouterModule, Field, SharedModule, PreferencesPanelComponent],
})
export class SignInComponent implements OnInit {
  private signInService = inject(SignInService);
  private authService = inject(AuthenticationService);
  private stateStorage = inject(StateStorageService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  protected isLoging = signal(false);
  errorUserNotActivated = signal(false);
  hide = signal(true);

  protected loginModel = signal<SignInModel>({
    login: '',
    password: '',
    rememberMe: false,
  });

  protected loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.login, { message: 'ngelmakTranslation.auth.signIn.username.required' });
    required(schemaPath.password, { message: 'ngelmakTranslation.auth.signIn.password.required' });
  });

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  signIn(): void {
    this.isLoging.set(true);
    const credentials = this.loginModel();
    credentials.login = credentials.login.trim().toLocaleLowerCase();
    this.signInService
      .signIn(credentials)
      .pipe(finalize(() => this.isLoging.set(false)))
      .subscribe({
        next: async () => {
          // Authentication successful
          const intendedUrl = await this.stateStorage.getUrl();
          await this.stateStorage.clearUrl();
          // Navigate to the intended URL or home page
          if (intendedUrl) {
            this.router.navigateByUrl(intendedUrl);
          } else {
            this.router.navigate(['']);
          }
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.auth.signIn.alerts.success',
            message: 'Connexion avec succès!',
          });
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError;
          if (apiError?.errorKey === 'userNotActivated') {
            this.errorUserNotActivated.set(true);
          } else {
            this.alertService.addAlert({
              type: 'error',
              translationKey: 'ngelmakTranslation.auth.signIn.alerts.error',
              message:
                "<strong>Erreur d'authentification !</strong> Veuillez vérifier vos identifiants de connexion.",
            });
          }
        },
      });
  }
}

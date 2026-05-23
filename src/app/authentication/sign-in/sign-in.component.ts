import { Component, OnInit, inject, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { SignInModel } from 'app/authentication/sign-in/sign-in.model';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { LanguageSwitcherComponent } from 'app/shared/language-switcher/language-switcher.component';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [SharedModule, RouterModule, Field, SharedModule, LanguageSwitcherComponent],
})
export class SignInComponent implements OnInit {
  private signInService = inject(SignInService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  protected isLoging = signal(false);
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
        next: () => {
          // There were no routing during signIn (eg from navigationToStoredUrl)
          if (!this.router.currentNavigation()) {
            this.router.navigate(['']);
          } else {
            console.log('Current Navigation', this.router.currentNavigation());
          }
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.auth.signIn.alerts.success',
            message: 'Connexion avec succès!',
          });
        },
        error: () => {
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'ngelmakTranslation.auth.signIn.alerts.error',
            message:
              "<strong>Erreur d'authentification !</strong> Veuillez vérifier vos identifiants de connexion.",
          });
        },
      });
  }
}

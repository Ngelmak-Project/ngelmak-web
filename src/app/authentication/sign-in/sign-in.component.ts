import { SignInModel } from 'app/authentication/sign-in/sign-in.model';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from 'app/shared/alert/alert.service';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { AuthenticationService } from 'app/core/auth/auth.service';
import SharedModule from 'app/shared/shared.module';
import { Field, form, required } from '@angular/forms/signals';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',

  imports: [SharedModule, RouterModule, Field],
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
    required(schemaPath.login, { message: 'Username is required' });
    required(schemaPath.password, { message: 'Password is required' });
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
            message: 'Connexion avec succès!',
          });
        },
        error: () => {
          this.alertService.addAlert({
            type: 'error',
            message:
              "<strong>Erreur d'authentification !</strong> Veuillez vérifier vos identifiants de connexion.",
          });
        },
      });
  }
}

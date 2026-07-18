import { Routes } from '@angular/router';
import { ActivateComponent } from 'app/authentication/activate/activate.component';
import { SignInComponent } from 'app/authentication/sign-in/sign-in.component';
import { SignUpComponent } from 'app/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResendActivationComponent } from './authentication/resend-activation/resend-activation.component';
import { PasswordResetComponent } from './authentication/password-reset/password-reset.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'ngelmakTranslation.auth.signIn.pageTitle',
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    title: 'ngelmakTranslation.auth.signUp.pageTitle',
  },
  {
    path: 'activate',
    component: ActivateComponent,
    title: 'ngelmakTranslation.auth.activate.pageTitle',
  },
  {
    path: 'resend-activation',
    component: ResendActivationComponent,
    title: 'ngelmakTranslation.auth.resendActivation.pageTitle',
  },
  {
    path: 'password-reset',
    component: ForgotPasswordComponent,
    title: 'ngelmakTranslation.auth.forgotPassword.pageTitle',
  },
  {
    path: 'password-reset-finish',
    component: PasswordResetComponent,
    title: 'ngelmakTranslation.auth.PasswordReset.pageTitle',
  },
  {
    path: '',
    loadChildren: () => import('app/layouts/main/main.module').then((m) => m.MainModule),
  },
];

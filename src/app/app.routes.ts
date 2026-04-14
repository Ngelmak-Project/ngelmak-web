import { Routes } from '@angular/router';
import { ActivateComponent } from 'app/authentication/activate/activate.component';
import { SignInComponent } from 'app/authentication/sign-in/sign-in.component';
import { SignUpComponent } from 'app/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResendActivationComponent } from './authentication/resend-activation/resend-activation.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'auth.signIn.title',
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    title: 'auth.signUp.title',
  },
  {
    path: 'activate',
    component: ActivateComponent,
    title: 'auth.activate.title',
  },
  {
    path: 'resend-activation',
    component: ResendActivationComponent,
    title: 'auth.resendActivation.title',
  },
  {
    path: 'reset-password',
    component: ForgotPasswordComponent,
    title: 'auth.resetPasswordInit.title',
  },
  {
    path: 'reset-password-finish',
    component: ResetPasswordComponent,
    title: 'auth.resetPasswordFinish.title',
  },
  {
    path: '',
    loadChildren: () => import('app/layouts/main/main.module').then((m) => m.MainModule),
  },
];

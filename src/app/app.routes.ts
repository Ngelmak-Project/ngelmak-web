import { Routes } from '@angular/router';
import { ActivateComponent } from 'app/authentication/activate/activate.component';
import { SignInComponent } from 'app/authentication/sign-in/sign-in.component';
import { SignUpComponent } from 'app/authentication/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'sign-in.title',
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    title: 'sign-up.title',
  },
  {
    path: 'activate',
    component: ActivateComponent,
    title: 'activate.title',
  },
  {
    path: '',
    loadChildren: () => import('app/layouts/main/main.module').then((m) => m.MainModule),
  },
];

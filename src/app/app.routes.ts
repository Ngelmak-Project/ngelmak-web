import { SignInComponent } from 'app/authentication/sign-in/sign-in.component';
import { Routes } from '@angular/router';
import { ActivateComponent } from 'app/authentication/activate/activate.component';
import { SignUpComponent } from 'app/authentication/sign-up/sign-up.component';
import { errorRoute } from 'app/layouts/error/error.route';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('app/layouts/main/main.module').then((m) => m.MainModule),
  },
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
  ...errorRoute,
];

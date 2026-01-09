import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const errorRoute: Routes = [
  // {
  //   path: 'error',
  //   title: 'error.title',
  // },
  // {
  //   path: 'accessdenied',
  //   data: {
  //     errorMessage: 'error.http.403',
  //   },
  //   title: 'error.title',
  // },
  {
    path: '404',
    component: PageNotFoundComponent,
    data: {
      errorMessage: 'error.http.404',
    },
    title: 'error.title',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

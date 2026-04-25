import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const errorRoute: Routes = [
  {
    path: '404',
    component: PageNotFoundComponent,
    data: {
      errorMessage: 'error.http.404',
    },
    title: 'ngelmakTranslation.layouts.notFound.hero.pageTitle',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

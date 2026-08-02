import { Routes } from '@angular/router';
import HomeComponent from './home.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('app/entities/nk-post/feed/nk-post-feed.routes'),
      },
    ],
  },
];

export default homeRoutes;

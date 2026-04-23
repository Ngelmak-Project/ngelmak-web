import { Routes } from '@angular/router';

const entityRoutes: Routes = [
  {
    path: 'channel',
    title: 'channel.home.title',
    loadChildren: () => import('./nk-channel/nk-channel.routes'),
  },
  {
    path: 'post',
    title: 'post',
    loadChildren: () => import('./nk-post/nk-post.routes'),
  },
];

export default entityRoutes;

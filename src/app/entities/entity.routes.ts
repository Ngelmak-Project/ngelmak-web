import { Routes } from '@angular/router';

const entityRoutes: Routes = [
  {
    path: 'channel',
    loadChildren: () => import('./nk-channel/nk-channel.routes'),
  },
  {
    path: 'post',
    loadChildren: () => import('./nk-post/nk-post.routes'),
  },
];

export default entityRoutes;

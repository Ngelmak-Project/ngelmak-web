import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostDetailComponent } from './detail/nk-post-detail.component';
import PostResolve from './nk-post-routing-resolve.service';
import { PostUpdateComponent } from './update/nk-post-update.component';

const postRoute: Routes = [
  {
    path: ':id/view',
    component: PostDetailComponent,
    resolve: {
      post: PostResolve,
    },
  },
  {
    path: 'new',
    component: PostUpdateComponent,
    resolve: {
      post: PostResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostUpdateComponent,
    resolve: {
      post: PostResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default postRoute;

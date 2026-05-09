import { Routes } from '@angular/router';

import { PostDetailComponent } from './detail/nk-post-detail.component';
import PostResolve from './nk-post-routing-resolve.service';

const postRoute: Routes = [
  {
    path: ':id/view',
    component: PostDetailComponent,
    resolve: {
      post: PostResolve,
    },
  }
];

export default postRoute;

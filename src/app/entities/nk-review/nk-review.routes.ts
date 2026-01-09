import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReviewDetailComponent } from './detail/nk-review-detail.component';
import { ReviewComponent } from './list/nk-review.component';
import ReviewResolve from './route/nk-review-routing-resolve.service';
import { ReviewUpdateComponent } from './update/nk-review-update.component';

const reviewRoute: Routes = [
  {
    path: '',
    component: ReviewComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReviewDetailComponent,
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReviewUpdateComponent,
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReviewUpdateComponent,
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reviewRoute;

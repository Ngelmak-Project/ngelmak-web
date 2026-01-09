import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MembershipDetailComponent } from './detail/nk-membership-detail.component';
import { MembershipComponent } from './list/nk-membership.component';
import MembershipResolve from './route/nk-membership-routing-resolve.service';
import { MembershipUpdateComponent } from './update/nk-membership-update.component';

const membershipRoute: Routes = [
  {
    path: '',
    component: MembershipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MembershipDetailComponent,
    resolve: {
      membership: MembershipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MembershipUpdateComponent,
    resolve: {
      membership: MembershipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MembershipUpdateComponent,
    resolve: {
      membership: MembershipResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default membershipRoute;

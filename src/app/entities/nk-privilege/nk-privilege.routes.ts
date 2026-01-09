import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PrivilegeDetailComponent } from './detail/nk-privilege-detail.component';
import { PrivilegeUpdateComponent } from './update/nk-privilege-update.component';
import PrivilegeResolve from './route/nk-privilege-routing-resolve.service';

const privilegeRoute: Routes = [
  {
    path: '',
    component: PrivilegeDetailComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PrivilegeUpdateComponent,
    resolve: {
      privilege: PrivilegeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PrivilegeUpdateComponent,
    resolve: {
      privilege: PrivilegeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default privilegeRoute;

import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SecurityComponent } from './security/security-component';

const userAccountRoutes: Routes = [
  {
    path: 'account',
    data: {
      authorities: [Authority.USER],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('app/user-account/account/account-page.routes'),
  },
  {
    path: 'security',
    data: {
      authorities: [Authority.USER],
    },
    canActivate: [UserRouteAccessService],
    component: SecurityComponent,
  },
];

export default userAccountRoutes;

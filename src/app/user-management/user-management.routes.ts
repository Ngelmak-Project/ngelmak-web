import { Routes } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SecurityComponent } from './security/security-component';

const userManagementRoutes: Routes = [
  {
    path: 'channel',
    data: {
      authorities: [Authority.USER],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('app/user-management/channel/channel-page.routes'),
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

export default userManagementRoutes;

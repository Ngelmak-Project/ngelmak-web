import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConfigDetailComponent } from './detail/nk-config-detail.component';
import { ConfigComponent } from './list/nk-config.component';
import ConfigResolve from './route/nk-config-routing-resolve.service';
import { ConfigUpdateComponent } from './update/nk-config-update.component';

const configRoute: Routes = [
  {
    path: '',
    component: ConfigComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConfigDetailComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConfigUpdateComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConfigUpdateComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default configRoute;

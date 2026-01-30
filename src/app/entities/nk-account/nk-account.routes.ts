import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountComponent } from './list/nk-account.component';
import AccountResolve from './nk-account-routing-resolve.service';
import { AccountUpdateComponent } from './update/nk-account-update.component';
import { AccountDetailComponent } from './detail/nk-account-detail.component';
import { AccountViewComponent } from './view/nk-account-view.component';

const accountRoute: Routes = [
  {
    path: '',
    component: AccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountViewComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'my-account',
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    component: AccountDetailComponent,
    loadChildren: () => import('app/entities/nk-account/detail/nk-account-detail.routes'),
  },
  {
    path: ':id/edit',
    component: AccountUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default accountRoute;

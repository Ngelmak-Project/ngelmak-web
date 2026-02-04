import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountUpdateComponent } from './update/nk-account-update.component';
import { AccountViewComponent } from './view/nk-account-view.component';

const accountRoute: Routes = [
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
    path: ':id/edit',
    component: AccountUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default accountRoute;

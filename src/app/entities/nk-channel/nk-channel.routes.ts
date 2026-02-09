import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelUpdateComponent } from './update/nk-channel-update.component';
import { ChannelViewComponent } from './view/nk-channel-view.component';

const channelRoute: Routes = [
  {
    path: ':id/view',
    component: ChannelViewComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChannelUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChannelUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default channelRoute;

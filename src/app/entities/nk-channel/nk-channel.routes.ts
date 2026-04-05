import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelDetailComponent } from './detail/nk-channel-detail.component';
import channelResolve from './nk-channel-routing-resolve.service';
import { ChannelUpdateComponent } from './update/nk-channel-update.component';

const channelRoute: Routes = [
  {
    path: ':id',
    component: ChannelDetailComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      channel: channelResolve,
    },
  },
  {
    path: 'new',
    component: ChannelUpdateComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default channelRoute;

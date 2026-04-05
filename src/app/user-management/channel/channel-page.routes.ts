import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import channelResolve from 'app/entities/nk-channel/nk-channel-routing-resolve.service';
import { ChannelCommentsComponent } from './channel-comments/channel-comments.component';
import { ChannelPageComponent } from './channel-page.component';
import { ChannelPostsComponent } from './channel-posts/channel-posts.component';
import { ChannelReactionsComponent } from './channel-reactions/channel-reactions.component';

// Shared child routes for both "" and ":identifier"
const channelChildren: Routes = [
  { path: 'posts', component: ChannelPostsComponent },
  { path: 'comments', component: ChannelCommentsComponent },
  { path: 'reactions', component: ChannelReactionsComponent },
  {
    path: 'user-activity-report',
    loadChildren: () => import('app/entities/nk-ticket/nk-ticket.routes'),
  },
  { path: '**', redirectTo: 'posts' },
];

// Shared parent route config
const channelBaseRoute = {
  component: ChannelPageComponent,
  canActivate: [UserRouteAccessService],
  resolve: { channel: channelResolve },
  children: channelChildren,
};

const channelDetailRoute: Routes = [
  {
    path: '', // optional: no identifier → use local channel
    ...channelBaseRoute,
  },
  {
    path: ':identifier', // id OR slug
    ...channelBaseRoute,
  },
];

export default channelDetailRoute;

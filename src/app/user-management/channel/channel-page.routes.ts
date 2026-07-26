import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelCommentsComponent } from './channel-comments/channel-comments.component';
import { ChannelPageComponent } from './channel-page.component';
import { ChannelPostsComponent } from './channel-posts/channel-posts.component';
import { ChannelStatsComponent } from './channel-stats/channel-stats.component';

const channelDetailRoute: Routes = [
  {
    path: '', // optional: no identifier → use local channel
    component: ChannelPageComponent,
    canActivate: [UserRouteAccessService],
    children: [
      { path: 'posts', component: ChannelPostsComponent },
      { path: 'comments', component: ChannelCommentsComponent },
      { path: 'subscriptions', component: ChannelStatsComponent },
      {
        path: 'user-activity-report',
        loadChildren: () => import('app/entities/nk-ticket/nk-ticket.routes'),
      },
      { path: '**', redirectTo: 'posts' },
    ],
  },
];

export default channelDetailRoute;

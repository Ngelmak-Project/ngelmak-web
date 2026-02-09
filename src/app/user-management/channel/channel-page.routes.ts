import { Routes } from '@angular/router';
import { ChannelCommentsComponent } from './channel-comments/channel-comments.component';
import { ChannelPostsComponent } from './channel-posts/channel-posts.component';
import { ChannelReactionsComponent } from './channel-reactions/channel-reactions.component';
import { ChannelPageComponent } from './channel-page.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const channelDetailRoute: Routes = [
  {
    path: '',
    component: ChannelPageComponent,
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: 'posts',
        component: ChannelPostsComponent,
      },
      {
        path: 'comments',
        component: ChannelCommentsComponent,
      },
      {
        path: 'reactions',
        component: ChannelReactionsComponent,
      },
      {
        path: '**',
        redirectTo: 'posts',
      },
    ],
  },
];

export default channelDetailRoute;

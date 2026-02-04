import { Routes } from '@angular/router';
import { AccountCommentsComponent } from './account-comments/account-comments.component';
import { AccountPostsComponent } from './account-posts/account-posts.component';
import { AccountReactionsComponent } from './account-reactions/account-reactions.component';
import { AccountPageComponent } from './account-page.component';

const accountDetailRoute: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    children: [
      {
        path: 'posts',
        component: AccountPostsComponent,
      },
      {
        path: 'comments',
        component: AccountCommentsComponent,
      },
      {
        path: 'reactions',
        component: AccountReactionsComponent,
      },
      {
        path: '**',
        redirectTo: 'posts',
      },
    ],
  },
];

export default accountDetailRoute;

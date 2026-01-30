import { Routes } from '@angular/router';
import SettingsComponent from './account-setting/account-setting.component';
import { AccountPostComponent } from './account-post/account-post.component';

const accountDetailRoute: Routes = [
  {
    path: 'posts',
    component: AccountPostComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];

export default accountDetailRoute;

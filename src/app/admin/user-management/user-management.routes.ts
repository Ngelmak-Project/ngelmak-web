import { Routes } from '@angular/router';

import UserManagementComponent from './user-management.component';

const userManagementRoute: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
];

export default userManagementRoute;

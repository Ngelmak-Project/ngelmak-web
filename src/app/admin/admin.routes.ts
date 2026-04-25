import { Routes } from '@angular/router';

const adminRoutes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.routes'),
      },
      {
        path: 'inbox',
        loadChildren: () => import('./inbox/inbox.routes'),
      },
      {
        path: 'system',
        loadChildren: () => import('./system/system.routes'),
      },
      { path: '', redirectTo: 'user-management', pathMatch: 'full' }, // redirect to `user-management`
    ],
  },
];

export default adminRoutes;

import { Routes } from '@angular/router';

const entityRoutes: Routes = [
  {
    path: 'authority',
    title: 'ngelmakprojectApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'nk-account',
    title: 'ngelmakprojectApp.nkAccount.home.title',
    loadChildren: () => import('./nk-account/nk-account.routes'),
  },
  {
    path: 'privilege',
    title: 'ngelmakprojectApp.privilege.home.title',
    loadChildren: () => import('./nk-privilege/nk-privilege.routes'),
  },
  {
    path: 'config',
    title: 'ngelmakprojectApp.config.home.title',
    loadChildren: () => import('./nk-config/nk-config.routes'),
  },
  {
    path: 'post',
    title: 'post',
    loadChildren: () => import('./nk-post/nk-post.routes'),
  },
  {
    path: 'ticket',
    title: 'ngelmakprojectApp.ticket.home.title',
    loadChildren: () => import('./nk-ticket/nk-ticket.routes'),
  },
  {
    path: 'review',
    title: 'ngelmakprojectApp.review.home.title',
    loadChildren: () => import('./nk-review/nk-review.routes'),
  },
  {
    path: 'membership',
    title: 'ngelmakprojectApp.membership.home.title',
    loadChildren: () => import('./nk-membership/nk-membership.routes'),
  },
];

export default entityRoutes;

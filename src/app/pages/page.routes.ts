import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CommunityComponent } from './community/community.component';
import { ContactComponent } from './contact/contact.component';
import { PoliciesComponent } from './policies/policies.component';
import { ReportsComponent } from './reports/reports.component';
import { ModerationComponent } from './moderation/moderation.component';
import { DonationsComponent } from './donations/donations.component';

const pageRoutes: Routes = [
  {
    path: 'about',
    title: 'ngelmakprojectApp.about.title',
    component: AboutComponent,
  },
  {
    path: 'community',
    title: 'ngelmakprojectApp.community.title',
    component: CommunityComponent,
  },
  {
    path: 'moderation',
    title: 'ngelmakprojectApp.moderation.title',
    component: ModerationComponent,
  },
  {
    path: 'donations',
    title: 'ngelmakprojectApp.donations.title',
    component: DonationsComponent,
  },
  {
    path: 'contact',
    title: 'ngelmakprojectApp.contact.title',
    component: ContactComponent,
  },
  {
    path: 'policies',
    title: 'ngelmakprojectApp.policies.title',
    component: PoliciesComponent,
  },
  {
    path: 'reports',
    title: 'ngelmakprojectApp.reports.title',
    component: ReportsComponent,
  },
  {
    path: 'project',
    title: 'ngelmakprojectApp.project.home.title',
    loadChildren: () => import('./project/project.routes'),
  },
];

export default pageRoutes;

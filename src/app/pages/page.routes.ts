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
    title: 'ngelmakTranslation.pages.about.pageTitle',
    component: AboutComponent,
  },
  {
    path: 'community',
    title: 'ngelmakTranslation.pages.community.pageTitle',
    component: CommunityComponent,
  },
  {
    path: 'moderation',
    title: 'ngelmakTranslation.pages.moderation.pageTitle',
    component: ModerationComponent,
  },
  {
    path: 'donations',
    title: 'ngelmakTranslation.pages.donations.pageTitle',
    component: DonationsComponent,
  },
  {
    path: 'contact',
    title: 'ngelmakTranslation.pages.contact.pageTitle',
    component: ContactComponent,
  },
  {
    path: 'policies',
    title: 'ngelmakTranslation.pages.policies.pageTitle',
    component: PoliciesComponent,
  },
  {
    path: 'reports',
    title: 'ngelmakTranslation.pages.reports.pageTitle',
    component: ReportsComponent,
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.routes'),
  },
];

export default pageRoutes;

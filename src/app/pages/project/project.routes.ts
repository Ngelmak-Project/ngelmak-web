import { Routes } from '@angular/router';

import { FoundationsComponent } from './foundations/foundations.component';
import { GovernanceComponent } from './governance/governance.component';
import { InformationSharingComponent } from './information-sharing/information-sharing.component';
import { MobilityComponent } from './mobility/mobility.component';
import { VisionComponent } from './vision/vision.component';
import { RoadmapComponent } from './roadmap/roadmap.component';

const projectRoute: Routes = [
  {
    path: 'foundations',
    title: 'ngelmakTranslation.pages.project.foundations.pageTitle',
    component: FoundationsComponent,
  },
  {
    path: 'governance',
    title: 'ngelmakTranslation.pages.project.governance.pageTitle',
    component: GovernanceComponent,
  },
  {
    path: 'vision',
    title: 'ngelmakTranslation.pages.project.vision.pageTitle',
    component: VisionComponent,
  },
  {
    path: 'information-sharing',
    title: 'ngelmakTranslation.pages.project.informationSharing.pageTitle',
    component: InformationSharingComponent,
  },
  {
    path: 'mobility',
    title: 'ngelmakTranslation.pages.project.mobility.pageTitle',
    component: MobilityComponent,
  },
  {
    path: 'roadmap',
    title: 'ngelmakTranslation.pages.project.roadmap.pageTitle',
    component: RoadmapComponent,
  },
];

export default projectRoute;

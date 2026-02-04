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
    title: 'ngelmakprojectApp.foundations.title',
    component: FoundationsComponent,
  },
  {
    path: 'governance',
    title: 'ngelmakprojectApp.governance.title',
    component: GovernanceComponent,
  },
  {
    path: 'vision',
    title: 'ngelmakprojectApp.vision.title',
    component: VisionComponent,
  },
  {
    path: 'information-sharing',
    title: 'ngelmakprojectApp.info.title',
    component: InformationSharingComponent,
  },
  {
    path: 'mobility',
    title: 'ngelmakprojectApp.mobility.title',
    component: MobilityComponent,
  },
  {
    path: 'roadmap',
    title: 'ngelmakprojectApp.roadmap.title',
    component: RoadmapComponent,
  },
];

export default projectRoute;

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
    title: 'foundations.title',
    component: FoundationsComponent,
  },
  {
    path: 'governance',
    title: 'governance.title',
    component: GovernanceComponent,
  },
  {
    path: 'vision',
    title: 'vision.title',
    component: VisionComponent,
  },
  {
    path: 'information-sharing',
    title: 'info.title',
    component: InformationSharingComponent,
  },
  {
    path: 'mobility',
    title: 'mobility.title',
    component: MobilityComponent,
  },
  {
    path: 'roadmap',
    title: 'roadmap.title',
    component: RoadmapComponent,
  },
];

export default projectRoute;

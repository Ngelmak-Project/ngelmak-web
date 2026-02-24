import { Route } from '@angular/router';
import HealthComponent from './health/health.component';
import LogsComponent from './logs/logs.component';
import MetricsComponent from './metrics/metrics.component';

const systemRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'health',
        component: HealthComponent,
        title: 'global.menu.admin.health.title',
      },
      {
        path: 'logs',
        component: LogsComponent,
        title: 'global.menu.admin.logs.title',
      },
      {
        path: 'metrics',
        component: MetricsComponent,
        title: 'global.menu.admin.metrics.title',
      },
    ],
  },
];

export default systemRoutes;

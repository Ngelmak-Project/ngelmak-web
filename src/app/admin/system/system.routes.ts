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
      },
      {
        path: 'logs',
        component: LogsComponent,
      },
      {
        path: 'metrics',
        component: MetricsComponent,
      },
    ],
  },
];

export default systemRoutes;

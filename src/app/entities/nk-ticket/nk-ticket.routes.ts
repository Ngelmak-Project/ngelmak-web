import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TicketDetailComponent } from './detail/nk-ticket-detail.component';
import { TicketComponent } from './table/nk-ticket.component';
import TicketResolve from './nk-ticket-routing-resolve.service';

const ticketRoute: Routes = [
  {
    path: '',
    component: TicketComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id',
    component: TicketDetailComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRoute;

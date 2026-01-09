import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TicketDetailComponent } from './detail/nk-ticket-detail.component';
import { TicketComponent } from './list/nk-ticket.component';
import TicketResolve from './route/nk-ticket-routing-resolve.service';
import { TicketUpdateComponent } from './update/nk-ticket-update.component';

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
    path: ':id/view',
    component: TicketDetailComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TicketUpdateComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TicketUpdateComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRoute;

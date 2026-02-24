import { Route } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { ContactsComponent } from './contacts/contacts.component';
import InboxComponent from './inbox.component';
import { TicketDetailComponent } from 'app/entities/nk-ticket/detail/nk-ticket-detail.component';
import ticketResolve from 'app/entities/nk-ticket/nk-ticket-routing-resolve.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TicketComponent } from 'app/entities/nk-ticket/table/nk-ticket.component';

const inboxRoutes: Route[] = [
  {
    path: '',
    component: InboxComponent,
    children: [
      {
        path: 'reports',
        component: ReportsComponent,
        children: [
          {
            path: '',
            component: TicketComponent,
            canActivate: [UserRouteAccessService],
          },
          {
            path: ':id',
            component: TicketDetailComponent,
            resolve: {
              ticket: ticketResolve,
            },
            canActivate: [UserRouteAccessService],
          },
        ],
      },
      { path: 'contacts', component: ContactsComponent },
      { path: '', redirectTo: 'reports', pathMatch: 'full' },
    ],
  },
];

export default inboxRoutes;

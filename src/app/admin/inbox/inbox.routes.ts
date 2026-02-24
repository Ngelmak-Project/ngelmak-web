import { Route } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { ContactsComponent } from './contacts/contacts.component';
import InboxComponent from './inbox.component';
import ticketResolve from 'app/entities/nk-ticket/nk-ticket-routing-resolve.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReportComponent } from './reports/report-table/report-table.component';
import { ReportDetailComponent } from './reports/report-detail/report-detail.component';

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
            component: ReportComponent,
            canActivate: [UserRouteAccessService],
          },
          {
            path: ':id',
            component: ReportDetailComponent,
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

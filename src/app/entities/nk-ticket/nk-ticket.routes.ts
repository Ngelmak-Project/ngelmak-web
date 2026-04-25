import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TicketDetailComponent } from './detail/nk-ticket-detail.component';
import TicketResolve from './nk-ticket-routing-resolve.service';
import { UserActivityReportComponent } from './user-activity-report/user-activity-report.component';

const ticketRoute: Routes = [
  {
    path: '',
    title: 'ngelmakTranslation.entities.ticket.userActivityReport.pageTitle',
    component: UserActivityReportComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id',
    title: 'ngelmakTranslation.entities.ticket.details.pageTitle',
    component: TicketDetailComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRoute;

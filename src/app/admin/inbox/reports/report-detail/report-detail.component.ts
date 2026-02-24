import { Component, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ITicket } from 'app/entities/models/nk-ticket.model';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { ReviewDialogComponent } from 'app/entities/nk-review/dialog/nk-review-dialog.component';
import { ReviewComponent } from 'app/entities/nk-review/list/nk-review.component';
import { TicketService } from 'app/entities/nk-ticket/nk-ticket.service';

@Component({
  standalone: true,
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  imports: [RouterModule, SharedModule, FormatMediumDatetimePipe, ReviewComponent, ReviewDialogComponent],
  animations: [fadeInUp400ms],
})
export class ReportDetailComponent {
  ticket = input.required<ITicket>();

  ticketService = inject(TicketService);
  isSaving = signal(false);
  showMenu = signal(false);
  openReview = signal(false);

  loadChannel() {}
  loadPost() {}
  loadComment() {}

  previousState(): void {
    window.history.back();
  }
}

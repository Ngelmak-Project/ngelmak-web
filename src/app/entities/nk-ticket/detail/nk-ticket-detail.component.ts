import { Component, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { ReviewComponent } from 'app/entities/nk-review/list/nk-review.component';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { TicketService } from '../nk-ticket.service';
import { ChannelInitialsPipe } from 'app/shared/pipes/channel-initials.pipe';

@Component({
  standalone: true,
  selector: 'app-ticket-detail',
  templateUrl: './nk-ticket-detail.component.html',
  imports: [
    RouterModule,
    SharedModule,
    FormatMediumDatetimePipe,
    ReviewComponent,
    ChannelInitialsPipe,
  ],
  animations: [fadeInUp400ms],
})
export class TicketDetailComponent {
  ticket = input.required<ITicket>();

  ticketService = inject(TicketService);
  isSaving = signal(false);
  showMenu = signal(false);
  openReview = signal(false);
  isSubmittingResponse = signal(false);

  previousState(): void {
    window.history.back();
  }
}

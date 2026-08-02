import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IReview } from 'app/entities/models/nk-review.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { ReviewDialogComponent } from 'app/entities/nk-review/dialog/nk-review-dialog.component';
import { ReviewComponent } from 'app/entities/nk-review/list/nk-review.component';
import { ReviewService } from 'app/entities/nk-review/nk-review.service';
import { TicketService } from 'app/entities/nk-ticket/nk-ticket.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ChannelInitialsPipe } from 'app/shared/pipes/channel-initials.pipe';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  imports: [
    RouterModule,
    SharedModule,
    ReviewComponent,
    ReviewDialogComponent,
    ChannelInitialsPipe,
    FormatMediumDatetimePipe,
  ],
  animations: [fadeInUp400ms],
})
export class ReportDetailComponent {
  ticket = input.required<ITicket>();
  ticketSig = signal<ITicket>(null);

  protected ticketService = inject(TicketService);
  protected reviewService = inject(ReviewService);
  protected alertService = inject(AlertService);

  showMenu = signal(false);
  isResolving = signal(false);
  openReview = signal(false);

  constructor() {
    effect(() => this.ticketSig.set(this.ticket()));
  }

  /**
   * Method to call remote API for closing/open a ticket.
   */
  resolve(): void {
    this.isResolving.set(true);
    this.ticketService
      .resolve(this.ticket().id)
      .pipe(finalize(() => this.isResolving.set(false)))
      .subscribe({
        next: ({ body }) => {
          this.ticketSig.update((value) => ({ ...value, ...body }));
          this.alertService.addAlert({
            type: 'success',
            message: body.resolved ? 'Le ticket est maintenant fermé.' : 'Le ticket est ouvert.',
          });
        },
        error: () =>
          this.alertService.addAlert({ type: 'error',
            message: "Une error s'est produite." }),
      });
  }

  /**
   * Method call for closing the review dialog. It updates the review list if a new review is created.
   * @param newReview the new review to add to the list if exists.
   */
  onReviewed(newReview?: IReview | null): void {
    this.openReview.set(false);

    if (!newReview) return;

    newReview.isAuthor = true;
    this.reviewService.addLocal(newReview);
  }

  previousState(): void {
    window.history.back();
  }
}

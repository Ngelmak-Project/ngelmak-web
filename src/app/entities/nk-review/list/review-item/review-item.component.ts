import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { IReview } from 'app/entities/models/nk-review.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { finalize } from 'rxjs';
import { ReviewDialogComponent } from '../../dialog/nk-review-dialog.component';
import { ReviewService } from '../../nk-review.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-review-item',
  imports: [
    CommonModule,
    FormatMediumDatetimePipe,
    SharedModule,
    ReviewDialogComponent,
    ConfirmDialogComponent,
    FormatMediumDatetimePipe,
  ],
  templateUrl: './review-item.component.html',
})
export class ReviewItemComponent {
  review = input.required<IReview>();
  ticket = input.required<ITicket>();

  private reviewService = inject(ReviewService);
  private alertService = inject(AlertService);

  // UI state
  replyTo = signal<IReview | null>(null);
  openReview = signal(false);
  openConfirmDialog = signal(false);
  isDeleting = signal(false);

  /** Open reply dialog */
  reply(): void {
    this.replyTo.set(this.review());
    this.openReview.set(true);
  }

  /** Open edit dialog */
  update(): void {
    this.replyTo.set(null);
    this.openReview.set(true);
  }

  /** Handle dialog close (create or update) */
  onCreated(result: IReview | null): void {
    this.openReview.set(false);
    this.replyTo.set(null);

    if (!result) return;

    result.isAuthor = true;
    this.reviewService.addLocal(result);
  }

  /** Delete confirmation handler */
  deleteReview(confirm: boolean): void {
    this.openConfirmDialog.set(false);
    if (!confirm) return;

    this.isDeleting.set(true);

    this.reviewService
      .delete(this.review().id)
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe(() => {
        this.reviewService.removeLocal(this.review().id);
        this.alertService.addAlert({
          type: 'info',
          message: 'Message supprimé',
        });
      });
  }
}

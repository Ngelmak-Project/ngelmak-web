import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { IReview } from 'app/entities/models/nk-review.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { ReviewService } from '../nk-review.service';

@Component({
  standalone: true,
  selector: 'app-review-dialog',
  templateUrl: './nk-review-dialog.component.html',
  animations: [fadeInUp400ms],
  imports: [CommonModule, RouterModule, Field, SharedModule],
})
export class ReviewDialogComponent {
  ticket = input.required<ITicket>();
  replyTo = input<IReview>(null);
  review = input<IReview>(null);
  onclose = output<IReview | null>();

  reviewService = inject(ReviewService);
  alertService = inject(AlertService);

  reviewSig = signal<IReview>(null);
  isSaving = signal(false);

  reviewModel = signal<IReview>({
    content: '',
  });
  reviewForm = form(this.reviewModel, (r) => {
    required(r.content, { message: 'ngelmakTranslation.entities.review.dialog.content.required' });
    maxLength(r.content, 1000, { message: 'ngelmakTranslation.entities.review.dialog.content.maxLength' });
  });

  constructor() {
    effect(() => {
      if (this.review()) this.reviewModel.set(this.review());
    });
  }

  // Pourquoi diffusez-vous ces informations?
  save(): void {
    this.isSaving.set(true);
    const review: IReview = {
      ...this.reviewModel(),
      ticket: this.ticket(), // Set the concerned ticket.
      replyTo: this.replyTo(), // Set the review if in a case of reply.
    };
    if (review.id) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  protected subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        this.alertService.addAlert({
          type: 'success',
          translationKey: this.review()
            ? 'ngelmakTranslation.entities.review.dialog.alerts.updated'
            : 'ngelmakTranslation.entities.review.dialog.alerts.created',
          message: "L'enregistrement a été effectué avec succès.",
        });
        this.close(body);
      },
      error: () => {
        this.alertService.addAlert({
          type: 'error',
          translationKey: 'ngelmakTranslation.entities.review.dialog.alerts.error',
          message: "Une erreur s'est produite.",
        });
      },
    });
  }

  close(result?: IReview) {
    this.onclose.emit(result);
  }
}

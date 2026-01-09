import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { Status } from 'app/entities/enumerations/status.model';
import { IReview } from 'app/entities/models/nk-review.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { TicketService } from 'app/entities/nk-ticket/service/nk-ticket.service';
import { ReviewService } from '../service/nk-review.service';
import { ReviewFormGroup, ReviewFormService } from './nk-review-form.service';

@Component({
  standalone: true,
  selector: 'app-review-update',
  templateUrl: './nk-review-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;
  review: IReview | null = null;
  statusValues = Object.keys(Status);

  reviewsSharedCollection: IReview[] = [];
  ticketsSharedCollection: ITicket[] = [];

  protected reviewService = inject(ReviewService);
  protected reviewFormService = inject(ReviewFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReviewFormGroup = this.reviewFormService.createReviewFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.review = review;
      if (review) {
        this.updateForm(review);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.reviewFormService.getReview(this.editForm);
    if (review.id !== null) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(review: IReview): void {
    // this.review = review;
    // this.reviewFormService.resetForm(this.editForm, review);

    // this.reviewsSharedCollection = this.reviewService.addReviewToCollectionIfMissing<IReview>(this.reviewsSharedCollection, review.replyto);
    // this.nkAccountsSharedCollection = this.nkAccountService.addNkAccountToCollectionIfMissing<IAccount>(
    //   this.nkAccountsSharedCollection,
    //   review.account,
    // );
    // this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(this.ticketsSharedCollection, review.ticket);
  }

  protected loadRelationshipsOptions(): void {
    // this.reviewService
    //   .query()
    //   .pipe(map((res: HttpResponse<IReview[]>) => res.body ?? []))
    //   .pipe(map((reviews: IReview[]) => this.reviewService.addReviewToCollectionIfMissing<IReview>(reviews, this.review?.replyto)))
    //   .subscribe((reviews: IReview[]) => (this.reviewsSharedCollection = reviews));

    // this.nkAccountService
    //   .query()
    //   .pipe(map((res: HttpResponse<IAccount[]>) => res.body ?? []))
    //   .pipe(
    //     map((nkAccounts: IAccount[]) =>
    //       this.nkAccountService.addNkAccountToCollectionIfMissing<IAccount>(nkAccounts, this.review?.account),
    //     ),
    //   )
    //   .subscribe((nkAccounts: IAccount[]) => (this.nkAccountsSharedCollection = nkAccounts));

    // this.ticketService
    //   .query()
    //   .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
    //   .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.review?.ticket)))
    //   .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}

import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective } from 'app/shared/sort';

import { ITicket } from 'app/entities/models/nk-ticket.model';
import { ReviewService } from '../nk-review.service';
import { IReview } from 'app/entities/models/nk-review.model';
import { ReviewDialogComponent } from '../dialog/nk-review-dialog.component';

@Component({
  standalone: true,
  selector: 'app-review',
  templateUrl: './nk-review.component.html',
  imports: [RouterModule, FormsModule, SharedModule, ReviewDialogComponent],
})
export class ReviewComponent implements OnInit {
  ticket = input.required<ITicket>();
  reviews = signal<IReview[]>([]);
  reviewService = inject(ReviewService);
  replyTo = signal<IReview>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.reviewService
      .findByTicket(this.ticket().id)
      .subscribe(({ body }) => this.reviews.set(body));
  }

  onReplied(newReviw: IReview): void {
    this.replyTo.set(null); // close the dialog.
    if (!newReviw) return;

  }
}

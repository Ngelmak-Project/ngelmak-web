import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IReview } from 'app/entities/models/nk-review.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { ReviewDialogComponent } from '../dialog/nk-review-dialog.component';
import { ReviewService } from '../nk-review.service';
import { ReviewUpdateComponent } from '../update/nk-review-update.component';
import { ReviewItemComponent } from './review-item/review-item.component';

@Component({
  standalone: true,
  selector: 'app-review',
  templateUrl: './nk-review.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    ReviewUpdateComponent,
    ReviewDialogComponent,
    ReviewItemComponent,
  ],
})
export class ReviewComponent implements OnInit {
  ticket = input.required<ITicket>();

  private reviewService = inject(ReviewService);

  reviews = this.reviewService.reviews$;
  // UI state
  openReview = signal(false);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.reviewService
      .findByTicket(this.ticket().id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ body }) => this.reviewService.setReviews(body));
  }

  /** Handle dialog close (create or update) */
  onCreated(result: IReview | null): void {
    this.openReview.set(false);

    if (!result) return;

    result.isAuthor = true;
    this.reviewService.addLocal(result);
  }
}

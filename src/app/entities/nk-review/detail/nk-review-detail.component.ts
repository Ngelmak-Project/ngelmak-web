import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IReview } from 'app/entities/models/nk-review.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-review-detail',
  templateUrl: './nk-review-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ReviewDetailComponent {
  review = input<IReview | null>(null);

  previousState(): void {
    window.history.back();
  }
}

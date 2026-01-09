import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IReview } from 'app/entities/models/nk-review.model';
import { ReviewService } from '../service/nk-review.service';

@Component({
  standalone: true,
  templateUrl: './nk-review-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReviewDeleteDialogComponent {
  review?: IReview;

  protected reviewService = inject(ReviewService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reviewService.delete(id).subscribe(() => {

    });
  }
}

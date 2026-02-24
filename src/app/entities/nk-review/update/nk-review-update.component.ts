import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';


@Component({
  standalone: true,
  selector: 'app-review-update',
  templateUrl: './nk-review-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReviewUpdateComponent {
}

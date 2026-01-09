import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IComment } from 'app/entities/models/nk-comment.model';
import { CommentService } from '../nk-comment.service';

@Component({
  standalone: true,
  templateUrl: './nk-comment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CommentDeleteDialogComponent {
  comment?: IComment;

  protected commentService = inject(CommentService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentService.delete(id).subscribe(() => {

    });
  }
}

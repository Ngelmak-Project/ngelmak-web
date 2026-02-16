import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import SharedModule from 'app/shared/shared.module';

import { HttpResponse } from '@angular/common/http';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { CommentItemComponent } from './item/nk-comment-item.component';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-comment',
  templateUrl: './nk-comment.component.html',
  imports: [RouterModule, FormsModule, SharedModule, CommentUpdateComponent, CommentItemComponent],
})
export class CommentComponent implements OnInit {
  post = input.required<IPostDTO>();
  postSig = signal<IPostDTO>(null);

  protected commentService = inject(CommentService);
  comments = signal<ICommentDTO[]>([]);
  hasNext = signal(false);
  isLoading = signal(false);

  itemsPerPage = ITEMS_PER_PAGE;
  pageToLoad = 1;

  ngOnInit(): void {
    this.postSig.set(this.post());

    this.loadAll();
  }

  /**
   *
   * @returns
   */
  private loadAll(): void {
    // Skip is there is no comment yet.
    if (this.post().commentCount === 0) return;

    this.isLoading.set(true);
    const req = {
      page: this.pageToLoad - 1,
      size: this.itemsPerPage,
    };
    this.commentService
      .findByPost(this.postSig().id, req)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: HttpResponse<IPage<ICommentDTO>>) => {
          const { body } = res;
          this.hasNext.set(body.size == body.size);
          this.comments.set(body.content ?? []);
        },
      });
  }

  /**
   * Removes a deleted comment from the local comment list and updates
   * the post's comment count accordingly.
   *
   * This method is typically called after the API confirms that a comment
   * has been successfully deleted on the server.
   *
   * @param deleteComment - The comment object returned by the delete action,
   *                        containing at least the ID of the removed comment.
   */
  onDeleted(deleteComment: ICommentDTO) {
    // Decrement the total comment count for the post
    this.postSig.update((p) => ({ ...p, commentCount: p.commentCount - 1 }));
    // Update the reactive comments signal with the new list
    this.comments.update((list) => list.filter((c) => c.id !== deleteComment.id));
  }

  /**
   * Adds a newly created comment to the comment list and updates
   * the post's comment count.
   *
   * @param newComment - The freshly created comment returned by the server.
   */
  onComment(newComment: ICommentDTO) {
    // Increase the total number of comments on the post
    this.postSig.update((p) => ({ ...p, commentCount: p.commentCount + 1 }));
    // end the new comment to the current list
    this.comments.update((list) => [...list, newComment]);
  }

  onCancel() {
    // No action needed on cancel for the main comment form, as it will simply reset the form fields.
    // However, if you want to perform any additional cleanup or state reset when the comment creation is cancelled,
    // you can implement that logic here.
  }
}

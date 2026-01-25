import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import SharedModule from 'app/shared/shared.module';

import { HttpResponse } from '@angular/common/http';
import { IFeedDTO } from 'app/entities/models/nk-feed.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { CommentItemComponent } from './item/nk-comment-item.component';

@Component({
  standalone: true,
  selector: 'app-comment',
  templateUrl: './nk-comment.component.html',
  imports: [RouterModule, FormsModule, SharedModule, CommentUpdateComponent, CommentItemComponent],
})
export class CommentComponent implements OnInit {
  feed = input.required<IFeedDTO>();
  postSig = signal<IPostDTO>(null);
  // comment = input<ICommentDTO>();

  // onCreate = output<ICommentDTO>();
  // onDelete = output<ICommentDTO>();

  comments = signal<ICommentDTO[]>([]);
  hasNext = signal(false);
  isLoading = signal(false);
  protected commentService = inject(CommentService);

  itemsPerPage = ITEMS_PER_PAGE;
  pageToLoad = 1;

  ngOnInit(): void {
    this.postSig.set(this.feed().post);

    this.loadAll();
    // this.commentService.findByPost(this.post.id).subscribe({
    //   next: (res: HttpResponse<IPage<ICommentDTO>>) => {
    //     this.onResponseSuccess(res);
    //   },
    // });
    // this.subscription = combineLatest([this.activatedRoute.queryParamMap])
    //   .pipe(
    //     tap(([params]) => {
    //       this.query = params.get('q');
    //       const page = params.get(PAGE_HEADER);
    //       this.page = +(page ?? 1);
    //     }),
    //     tap(() => this.loadAll()),
    //   )
    //   .subscribe();
    // this.open();
  }

  loadAll(): void {
    this.isLoading.set(true);
    const req = {
      page: this.pageToLoad - 1,
      size: this.itemsPerPage,
    };
    this.commentService.findByPost(this.postSig().id, req).subscribe({
      next: (res: HttpResponse<IPage<ICommentDTO>>) => {
        const { body } = res;
        this.hasNext.set((body.size == body.size));
        this.comments.set(body.content ?? []);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
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
    // Append the new comment to the current list
    this.comments.update((list) => [...list, newComment]);
  }
}

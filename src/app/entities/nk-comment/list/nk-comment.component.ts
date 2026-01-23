import { Component, inject, Input, OnInit, signal } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-comment',
  templateUrl: './nk-comment.component.html',
  imports: [RouterModule, FormsModule, SharedModule, CommentUpdateComponent, CommentItemComponent],
})
export class CommentComponent implements OnInit {
  @Input() post: IPostDTO;
  @Input() comment: ICommentDTO;

  comments = signal<ICommentDTO[]>(null);
  hasPrevious = signal(false);
  hasNext = signal(false);
  isLoading = signal(false);

  itemsPerPage = ITEMS_PER_PAGE;
  pageToLoad = 1;

  protected commentService = inject(CommentService);

  ngOnInit(): void {
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
    this.commentService.findByPost(this.post.id, req).subscribe({
      next: (res: HttpResponse<IPage<ICommentDTO>>) => {
        this.onResponseSuccess(res);
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

  protected onResponseSuccess(response: HttpResponse<IPage<ICommentDTO>>): void {
    const { body } = response;
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.comments.set(body.content ?? []);
  }

  onComment(newComment: ICommentDTO) {
    this.post.commentCount++;
    this.comments().push(newComment);
  }
}

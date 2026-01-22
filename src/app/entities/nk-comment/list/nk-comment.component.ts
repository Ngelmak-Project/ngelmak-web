import { Component, inject, Input, NgZone, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from 'app/entities/nk-comment/nk-comment.service';
import { CommentUpdateComponent } from 'app/entities/nk-comment/update/nk-comment-update.component';
import { Subscription } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import SharedModule from 'app/shared/shared.module';
import { SortService } from 'app/shared/sort';

import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { CommentReactionDialogComponent } from 'app/entities/nk-comment-reaction/dialog/nk-comment-reaction-dialog.component';
import { DurationPipe } from 'app/shared/date';
import { IPage } from 'app/shared/pagination/pagination.model';

@Component({
  standalone: true,
  selector: 'app-comment',
  templateUrl: './nk-comment.component.html',
  imports: [RouterModule, FormsModule, SharedModule, DurationPipe, CommentUpdateComponent, CommentReactionDialogComponent],
})
export class CommentComponent implements OnInit {
  @Input() post: IPostDTO;

  subscription: Subscription | null = null;
  comments = signal<ICommentDTO[]>(null);
  hasPrevious = signal(false);
  hasNext = signal(false);
  isLoading = signal(false);

  itemsPerPage = ITEMS_PER_PAGE;
  pageToLoad = 1;

  public router = inject(Router);
  protected commentService = inject(CommentService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected authService = inject(AuthenticationService);
  // readonly dialog = inject(MatDialog);
  account = inject(AccountService).trackCurrentAccount();

  protected ngZone = inject(NgZone);

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
    console.log(body);
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.comments.set(body.content ?? []);
  }

  protected handleNavigation(page: number, query?: string): void {
    const queryParamsObj = { q: query, page, size: this.itemsPerPage };
    this.ngZone.run(() => {
      this.router.navigate(['/', query.length > 0 ? 'search' : ''], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}

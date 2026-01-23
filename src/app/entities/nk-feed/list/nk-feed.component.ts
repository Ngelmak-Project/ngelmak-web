import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, Subscription, tap } from 'rxjs';
import { FeedItem } from './item/nk-feed-item';

import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE, PAGE_HEADER } from 'app/config/pagination.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { IFeedDTO } from 'app/entities/models/nk-feed.model';
import SharedModule from 'app/shared/shared.module';
import { SortService, sortStateSignal } from 'app/shared/sort';

import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { IPage } from 'app/shared/pagination/pagination.model';
import { FeedService } from '../nk-feed.service';

@Component({
  standalone: true,
  selector: 'app-feed',
  templateUrl: './nk-feed.component.html',
  imports: [RouterModule, FormsModule, SharedModule, FeedItem],
  // providers: [provideNativeDateAdapter()],
})
export class FeedComponent implements OnInit {
  subscription: Subscription | null = null;
  feeds = signal<IFeedDTO[]>(null);
  hasPrevious = signal(false);
  hasNext = signal(false);
  isLoading = signal(false);

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;
  query = '';

  public router = inject(Router);
  protected feedService = inject(FeedService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected authService = inject(AuthenticationService);
  // readonly dialog = inject(MatDialog);
  account = inject(AccountService).trackCurrentAccount();

  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap])
      .pipe(
        tap(([params]) => {
          this.query = params.get('q');
          const page = params.get(PAGE_HEADER);
          this.page = +(page ?? 1);
        }),
        tap(() => this.loadAll()),
      )
      .subscribe();
    this.open();
  }

  loadAll(): void {
    const { page, query } = this;
    this.isLoading.set(true);
    const pageToLoad: number = page;
    const req = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      q: query,
    };
    this.feedService.query(req).subscribe({
      next: (res: HttpResponse<IPage<IFeedDTO>>) => {
        this.onResponseSuccess(res);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  open() {
    // const dialogRef = this.dialog.open(FeedUpdateComponent, {
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    //   disableClose: true,
    //   width: "80vw",
    //   maxWidth: "100vw",
    //   maxHeight: "80vw",
    // });
    // dialogRef
    //   .afterClosed()
    //   .subscribe((res) => res && this.loadAll());
  }

  search(query: string): void {
    this.handleNavigation(this.page, query);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  protected onResponseSuccess(response: HttpResponse<IPage<IFeedDTO>>): void {
    const { body } = response;
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.feeds.set(body.content ?? []);
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

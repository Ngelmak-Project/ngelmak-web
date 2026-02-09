import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';

import { SORT } from 'app/config/navigation.constants';
import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPage } from 'app/shared/pagination/pagination.model';
import SharedModule from 'app/shared/shared.module';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { UserManagementService } from '../user-management.service';
import { ClickOutsideDirective } from "app/shared/directives/click-outside.directive";

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [RouterModule, SharedModule, FormatMediumDatetimePipe, ClickOutsideDirective],
})
export default class UserManagementComponent implements OnInit {
  /** Dependencies */
  private router = inject(Router);
  private userService = inject(UserManagementService);
  private sortService = inject(SortService);
  private activatedRoute = inject(ActivatedRoute);
  adminUser = inject(AuthenticationService).authentication;

  /** UI state */
  openMenu = signal(-1);

  /** Data state */
  users = signal<Authentication[] | null>(null);
  isLoading = signal(false);
  totalItems = signal(245);

  /** Pagination state */
  pageSize = signal(10);
  currentPage = signal(1);
  hasNextPage = signal(true);
  /** Whether the page-size dropdown should be hidden */
  hidePageSizeOptions = signal(true);

  /** Sorting state */
  sortState = sortStateSignal({order: 'desc', predicate: 'createdDate'});

  ngOnInit(): void {
    this.handleNavigation();
  }

  /**
   * Activate or deactivate a user.
   * Reloads the list after the update completes.
   */
  setActive(user: Authentication, isActivated: boolean): void {
    this.userService.update({ ...user, activated: isActivated }).subscribe(() => {
      this.loadAll();
    });
  }

  /**
   * Fetches the user list based on current pagination and sorting.
   */
  loadAll(): void {
    this.isLoading.set(true);

    this.userService
      .query({
        page: this.currentPage() - 1, // backend is 0‑indexed
        size: this.pageSize(),
        sort: this.sortService.buildSortParam(this.sortState(), 'createdDate'),
      })
      .subscribe({
        next: ({ body }: HttpResponse<IPage<Authentication>>) => {
          this.isLoading.set(false);

          if (!body) return;

          this.totalItems.set(Number(body.totalElements));
          this.users.set(body.content);

          // Update next-page availability
          const totalPages = Math.ceil(body.totalElements / this.pageSize());
          this.hasNextPage.set(this.currentPage() < totalPages);
        },
        error: () => this.isLoading.set(false),
      });
  }

  /**
   * Watches route changes and updates pagination + sorting accordingly.
   * Automatically reloads data when URL parameters change.
   */
  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(
      ([data, params]) => {
        // PAGE
        const page = Number(params.get('page'));
        this.currentPage.set(!isNaN(page) && page > 0 ? page : 1);
        // PAGE SIZE
        const size = Number(params.get('size'));
        if (!isNaN(size) && size > 0) {
          this.pageSize.set(size);
        }
        // SORT
        this.sortState.set(
          this.sortService.parseSortParam(params.get(SORT) ?? data['defaultSort']),
        );

        this.loadAll();
      },
    );
  }

  /**
   * Navigate to a specific page.
   * Validates the input and updates the URL, which triggers data reload.
   */
  goToPage(pageIndex: number): void {
    if (isNaN(pageIndex) || pageIndex <= 0) {
      console.warn('Invalid page number:', pageIndex);
      return;
    }

    this.currentPage.set(pageIndex);

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.currentPage(),
        size: this.pageSize(),
        sort: this.sortService.buildSortParam(this.sortState()),
      },
    });
  }

  /**
   * Change the number of items per page.
   * Resets to page 1 and reloads.
   */
  changePageSize(size: number): void {
    this.hidePageSizeOptions.set(true);
    if (isNaN(size) || size <= 0 || size === this.pageSize()) return;

    this.pageSize.set(size);
    this.currentPage.set(1);
    this.goToPage(1);
  }

  /**
   * Navigate to the next page if available.
   */
  nextPage(): void {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  /**
   * Navigate to the previous page if not on the first page.
   */
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, computed, inject, NgZone, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize, Subscription, tap } from 'rxjs';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPage } from 'app/shared/pagination/pagination.model';
import SharedModule from 'app/shared/shared.module';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { IUser } from './user-management.model';
import { UserManagementService } from './user-management.service';

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [RouterModule, SharedModule, FormatMediumDatetimePipe],
})
export default class IUserManagementComponent implements OnInit {
  /** Dependencies */
  private router = inject(Router);
  private userService = inject(UserManagementService);
  private sortService = inject(SortService);
  private activatedRoute = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  protected ngZone = inject(NgZone);
  adminUser = inject(AuthenticationService).authentication;

  /** UI state */
  openMenu = signal(-1);

  /** Data state */
  users = signal<IUser[] | null>(null);
  isLoading = signal(false);
  loadingSignal = signal(false);
  totalItems = signal(245);

  /** Pagination state */
  pageSize = signal(10);
  currentPage = signal(1);
  hasNextPage = signal(true);
  hidePageSizeOptions = signal(true);

  /** Sorting state */
  sortState = sortStateSignal({ order: 'desc', predicate: 'createdDate' });

  /** Search state */
  query = signal('');
  selectedDateRange = signal<string>('Last 30 days');
  isDateFilterOpen = signal(false);
  validForSearch = computed(() => {
    const trimmedQuery = this.query().trim();
    return trimmedQuery.length >= 2;
  });

  /** Constants */
  itemsPerPage = ITEMS_PER_PAGE;

  dateRangeOptions = [
    { label: 'Last day', value: '1d', days: 1 },
    { label: 'Last 7 days', value: '7d', days: 7 },
    { label: 'Last 30 days', value: '30d', days: 30 },
    { label: 'Last 3 months', value: '90d', days: 90 },
    { label: 'Last year', value: '1y', days: 365 },
    { label: 'All time', value: 'all', days: 0 },
  ];

  private subs = new Subscription();

  ngOnInit(): void {
    /**
     * Read the search query from the URL.
     * When query parameter changes, reset pagination and load data.
     */
    this.subs.add(
      this.activatedRoute.queryParamMap
        .pipe(
          tap((params) => {
            const queryParam = params.get('q') ?? '';
            this.query.set(queryParam);
          }),
          tap(() => {
            // Reset pagination when query changes
            this.currentPage.set(1);
            this.loadAll();
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Toggle the date range filter dropdown.
   */
  toggleDateFilter(): void {
    this.isDateFilterOpen.update((open) => !open);
  }

  /**
   * Select a date range option and close the dropdown.
   */
  selectDateRange(option: { label: string; value: string; days: number }): void {
    this.selectedDateRange.set(option.label);
    this.isDateFilterOpen.set(false);
    // Optionally trigger a new search with the selected date range
    // You can pass the date range value to your API if needed
  }

  /**
   * Clear the search input and reset to initial state.
   */
  clearSearch(): void {
    this.query.set('');
    this.currentPage.set(1);
    this.handleNavigation(undefined);
  }

  /**
   * Perform the search when user clicks search button or presses Enter.
   * Updates the URL with the query parameter, which triggers loadAll().
   */
  search(): void {
    if (!this.validForSearch()) {
      return;
    }

    // Reset to first page
    this.currentPage.set(1);

    // Navigate with the search query
    this.handleNavigation(this.query().trim());
  }

  /**
   * Activate or deactivate a user.
   * Reloads the list after the update completes.
   */
  setActive(user: IUser, isActivated: boolean): void {
    this.userService.setActive(user.id, isActivated).subscribe(() => {
      this.loadAll();
    });
  }

  /**
   * Block or unblock a user.
   * @param user to block/unblock.
   */
  toggleBlock(user: IUser): void {
    const id = user.id;
    const targetState = !user.blocked; // true = block, false = unblock

    this.loadingSignal.set(true);

    const request$ = targetState
      ? this.userService.blockUser(id)
      : this.userService.unblockUser(id);

    request$.pipe(finalize(() => this.loadingSignal.set(false))).subscribe(() => {
      this.alertService.addAlert({
        type: 'success',
        translationKey: targetState
          ? 'userManagement.block.success'
          : 'userManagement.unblock.success',
        translationParams: { param: id },
        message: `Utilisateur @${user.login} a été ${targetState ? 'bloqué' : 'débloqué'} avec succès.`,
      });

      this.users.update(
        (users) => users?.map((u) => (u.id === id ? { ...u, blocked: targetState } : u)) ?? null,
      );

      this.openMenu.set(-1);
    });
  }

  /**
   * Fetches the user list based on current pagination and sorting.
   * If a query is present, it uses the search endpoint with optional q parameter.
   * Otherwise, it uses the standard list endpoint with pagination.
   */
  loadAll(): void {
    this.isLoading.set(true);

    const currentQuery = this.query().trim();
    const sortParam = this.sortService.buildSortParam(this.sortState(), 'createdDate');

    const req = {
      page: this.currentPage() - 1, // zero-based index for backend
      size: this.pageSize(),
      sort: sortParam,
      q: currentQuery || undefined, // only include q if it's non-empty
    };
    // Determine which endpoint to use
    this.userService
      .query(req)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ body }: HttpResponse<IPage<IUser>>) => {
          if (!body) {
            return;
          }

          this.totalItems.set(Number(body.totalElements));
          this.users.set(body.content);
          console.log(body.content);

          // Update next-page availability
          const totalPages = Math.ceil(body.totalElements / this.pageSize());
          this.hasNextPage.set(this.currentPage() < totalPages);
        },
        error: (error) => {
          this.alertService.addAlert({
            type: 'error',
            message: 'Erreur lors du chargement des utilisateurs.',
          });
          console.error('Error loading users:', error);
        },
      });
  }

  /**
   * Update the URL with the search query.
   * This triggers the queryParamMap subscription which calls loadAll().
   */
  protected handleNavigation(query?: string): void {
    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          page: this.currentPage(),
          size: this.pageSize(),
          sort: this.sortService.buildSortParam(this.sortState(), 'createdDate'),
          q: query || null, // null removes the parameter from URL
        },
        queryParamsHandling: 'merge', // Preserve existing params and merge new ones
      });
    });
  }

  /**
   * Navigate to a specific page.
   * Updates internal state and reloads data.
   */
  goToPage(pageIndex: number): void {
    if (isNaN(pageIndex) || pageIndex <= 0) {
      console.warn('Invalid page number:', pageIndex);
      return;
    }

    this.currentPage.set(pageIndex);
    this.loadAll();
  }

  /**
   * Change the number of items per page.
   * Resets to page 1 and reloads.
   */
  changePageSize(size: number): void {
    this.hidePageSizeOptions.set(true);

    if (isNaN(size) || size <= 0 || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadAll();
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

  // In your component class
  getDisplayName(user: IUser): string {
    const firstName = user.firstName?.trim() || '';
    const lastName = user.lastName?.trim() || '';

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    return user.login || user.email?.split('@')[0] || 'User';
  }

  getAvatarInitial(user: IUser): string {
    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();

    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    if (user.login) return user.login.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();

    return '?';
  }
}

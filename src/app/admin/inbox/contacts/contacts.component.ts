import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IContactMessage } from 'app/admin/user-management/user-management.model';
import { UserManagementService } from 'app/admin/user-management/user-management.service';
import { SORT } from 'app/config/navigation.constants';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { stagger150ms } from 'app/shared/animations/stagger.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { combineLatest, finalize } from 'rxjs';
import { OpenMessageComponent } from './open-message/open-message.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  imports: [CommonModule, FormatMediumDatetimePipe, ClickOutsideDirective, OpenMessageComponent],
  animations: [fadeInUp400ms, stagger150ms],
})
export class ContactsComponent {
  /** Dependencies */
  private router = inject(Router);
  private userManagementService = inject(UserManagementService);
  private sortService = inject(SortService);
  private activatedRoute = inject(ActivatedRoute);

  openMenu = signal(-1);

  /** Data state */
  messages = signal<IContactMessage[] | null>([]);
  openMessage = signal<IContactMessage>(null);
  isLoading = signal(false);
  loadingSignal = signal(false);
  totalItems = signal(245);

  /** Pagination state */
  pageSize = signal(10);
  currentPage = signal(1);
  hasNextPage = signal(true);
  /** Whether the page-size dropdown should be hidden */
  hidePageSizeOptions = signal(true);

  /** Sorting state */
  sortState = sortStateSignal({ order: 'desc', predicate: 'createdDate' });

  ngOnInit(): void {
    this.handleNavigation();
  }

  /**
   * Method call to close the dialog and update the list.
   * @param message represents the newly updated message.
   * @returns
   */
  onCloseMessage(message: IContactMessage): void {
    this.openMessage.set(null); // close the dialog.
    if (!message) return;
    // Replace the updated message inside the list.
    this.messages.update((values) => values.map((msg) => (msg.id == message.id ? message : msg)));
  }

  /**
   * Fetches the ticket list based on current pagination and sorting.
   */
  loadAll(): void {
    this.isLoading.set(true);

    this.userManagementService
      .findContacts({
        page: this.currentPage() - 1, // backend is 0‑indexed
        size: this.pageSize(),
        sort: this.sortService.buildSortParam(this.sortState(), 'sentAt'),
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ body }) => {
          if (!body) return;

          this.totalItems.set(Number(body.totalElements));
          this.messages.set(body.content);

          // Update next-page availability
          const totalPages = Math.ceil(body.totalElements / this.pageSize());
          this.hasNextPage.set(this.currentPage() < totalPages);
        },
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { stagger150ms } from 'app/shared/animations/stagger.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { combineLatest, finalize } from 'rxjs';
import { TicketService } from '../nk-ticket.service';
import { TicketOpenComponent } from '../open/nk-ticket-open.component';

@Component({
  standalone: true,
  selector: 'app-user-activity-report',
  templateUrl: './user-activity-report.component.html',
  imports: [RouterModule, FormsModule, SharedModule, TicketOpenComponent, FormatMediumDatetimePipe],
  animations: [fadeInUp400ms, stagger150ms],
})
export class UserActivityReportComponent implements OnInit {
  /** Dependencies */
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private activatedRoute = inject(ActivatedRoute);

  showMenu = signal(-1);

  /* Data state */
  tickets = signal<ITicket[] | null>([]);
  openTicket = signal<ITicket>(null);

  isLoading = signal(false);
  loadingSignal = signal(false);
  totalItems = signal(245);

  /* Pagination state */
  pageSize = signal(10);
  currentPage = signal(1);
  hasNextPage = signal(true);
  /* Whether the page-size dropdown should be hidden */
  hidePageSizeOptions = signal(true);

  ngOnInit(): void {
    this.handleNavigation();
  }

  /**
   * Fetches the ticket list based on current pagination and sorting.
   */
  loadAll(): void {
    this.isLoading.set(true);

    this.ticketService
      .userActivityReports({
        page: this.currentPage() - 1, // backend is 0‑indexed
        size: this.pageSize(),
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ body }) => {
          if (!body) return;

          this.totalItems.set(Number(body.totalElements));
          this.tickets.set(body.content);

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

  navigateTo(id: number): void {
    this.router.navigate([id]);
  }
}

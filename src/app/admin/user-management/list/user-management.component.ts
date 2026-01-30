import { HttpResponse } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest } from "rxjs";

import { SORT } from "app/config/navigation.constants";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { Authentication } from "app/core/auth/auth.model";
import { AuthenticationService } from "app/core/auth/auth.service";
import { IPage } from "app/shared/pagination/pagination.model";
import SharedModule from "app/shared/shared.module";
import { SortService, sortStateSignal } from "app/shared/sort";
import { UserManagementService } from "../service/user-management.service";

@Component({
  standalone: true,
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  imports: [RouterModule, SharedModule],
})
export default class UserManagementComponent implements OnInit {
  currentUser = inject(AuthenticationService).authentication;
  private router = inject(Router);
  private userService = inject(UserManagementService);
  private sortService = inject(SortService);
  private activatedRoute = inject(ActivatedRoute);

  users = signal<Authentication[] | null>(null);
  isLoading = signal(false);
  totalItems = signal(0);
  size = ITEMS_PER_PAGE;
  page!: number;
  sortState = sortStateSignal({});

  ngOnInit(): void {
    this.handleNavigation();
  }

  setActive(user: Authentication, isActivated: boolean): void {
    this.userService
      .update({ ...user, activated: isActivated })
      .subscribe(() => this.loadAll());
  }

  trackIdentity(_index: number, item: Authentication): number {
    return item.id!;
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.userService
      .query({
        page: this.page - 1,
        size: this.size,
        sort: this.sortService.buildSortParam(this.sortState(), "id"),
      })
      .subscribe({
        next: ({ body }: HttpResponse<IPage<Authentication>>) => {
          this.isLoading.set(false);
          this.totalItems.set(Number(body.totalElements));
          this.users.set(body.content);
        },
        error: () => this.isLoading.set(false),
      });
  }

  private handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = Number(params.get("page"));
      this.page = page ?? 1;
      this.sortState.set(
        this.sortService.parseSortParam(params.get(SORT) ?? data["defaultSort"])
      );
      this.loadAll();
    });
  }

  pageChange({ pageIndex, pageSize }): void {
    this.page = pageIndex;
    this.size = pageSize;
    this.router.navigate(["./"], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.sortService.buildSortParam(this.sortState()),
      },
    });
  }
}

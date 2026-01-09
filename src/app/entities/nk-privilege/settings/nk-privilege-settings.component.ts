import { HttpHeaders } from "@angular/common/http";
import { Component, inject, NgZone, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Data,
  ParamMap,
  Router,
  RouterModule,
} from "@angular/router";
import { combineLatest, Observable, Subscription, tap } from "rxjs";

import { FormsModule } from "@angular/forms";
import SharedModule from "app/shared/shared.module";
import {
  SortService,
  sortStateSignal,
  type SortState
} from "app/shared/sort";

import { DEFAULT_SORT_DATA, SORT } from "app/config/navigation.constants";
import {
  ITEMS_PER_PAGE,
  PAGE_HEADER,
  TOTAL_COUNT_RESPONSE_HEADER,
} from "app/config/pagination.constants";
import { IPrivilege } from "app/entities/models/nk-privilege.model";
import {
  EntityArrayResponseType,
  PrivilegeService,
} from "../service/nk-privilege.service";

@Component({
  standalone: true,
  selector: "app-privilege",
  templateUrl: "./nk-privilege-settings.component.html",
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
  ],
})
export class PrivilegeSettingsComponent implements OnInit {
  subscription: Subscription | null = null;
  privileges?: IPrivilege[];
  isLoading = false;

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  public router = inject(Router);
  protected privilegeService = inject(PrivilegeService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);

  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.activatedRoute.queryParamMap,
      this.activatedRoute.data,
    ])
      .pipe(
        tap(([params, data]) =>
          this.fillComponentAttributeFromRoute(params, data)
        ),
        tap(() => this.load())
      )
      .subscribe();
  }

  delete(privilege: IPrivilege): void {
    // const modalRef = this.modalService.open(PrivilegeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.privilege = privilege;
    // // unsubscribe not needed because closed completes on modal close
    // modalRef.closed
    //   .pipe(
    //     filter(reason => reason === ITEM_DELETED_EVENT),
    //     tap(() => this.load()),
    //   )
    //   .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected fillComponentAttributeFromRoute(
    params: ParamMap,
    data: Data
  ): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(
      this.sortService.parseSortParam(
        params.get(SORT) ?? data[DEFAULT_SORT_DATA]
      )
    );
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(
      response.body
    );
    this.privileges = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(
    data: IPrivilege[] | null
  ): IPrivilege[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(
    headers: HttpHeaders
  ): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.privilegeService
      .query(queryObject)
      .pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(["./"], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}

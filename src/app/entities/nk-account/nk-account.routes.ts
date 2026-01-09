import { Routes } from "@angular/router";

import { Authority } from "app/config/authority.constants";
import { ASC } from "app/config/navigation.constants";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { NkAccountComponent } from "./list/nk-account.component";
import NkAccountResolve from "./route/nk-account-routing-resolve.service";
import { NkAccountUpdateComponent } from "./update/nk-account-update.component";
import { NkAccountDetailComponent } from "./detail/nk-account-detail.component";
import { NkAccountViewComponent } from "./view/nk-account-view.component";

const nkAccountRoute: Routes = [
  {
    path: "",
    component: NkAccountComponent,
    data: {
      defaultSort: "id," + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id",
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    component: NkAccountDetailComponent,
    loadChildren: () => import("app/entities/nk-account/detail/nk-account-detail.routes"),
  },
  {
    path: ":id/view",
    component: NkAccountViewComponent,
    resolve: {
      nkAccount: NkAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: NkAccountUpdateComponent,
    resolve: {
      nkAccount: NkAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default nkAccountRoute;

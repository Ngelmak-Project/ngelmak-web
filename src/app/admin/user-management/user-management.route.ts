import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Routes } from "@angular/router";
import { of } from "rxjs";

import { Authentication } from "app/core/auth/auth.model";
import UserManagementDetailComponent from "./detail/user-management-detail.component";
import UserManagementComponent from "./list/user-management.component";
import { UserManagementService } from "./service/user-management.service";
import UserManagementUpdateComponent from "./update/user-management-update.component";

export const UserManagementResolve: ResolveFn<Authentication | null> = (
  route: ActivatedRouteSnapshot
) => {
  const login = route.paramMap.get("login");
  if (login) {
    return inject(UserManagementService).find(login);
  }
  return of(null);
};

const userManagementRoute: Routes = [
  {
    path: "",
    component: UserManagementComponent,
    data: {
      defaultSort: "id,asc",
    },
  },
  {
    path: ":login/view",
    component: UserManagementDetailComponent,
    resolve: {
      account: UserManagementResolve,
    },
  },
  {
    path: "new",
    component: UserManagementUpdateComponent,
    resolve: {
      account: UserManagementResolve,
    },
  },
  {
    path: ":login/edit",
    component: UserManagementUpdateComponent,
    resolve: {
      account: UserManagementResolve,
    },
  },
];

export default userManagementRoute;

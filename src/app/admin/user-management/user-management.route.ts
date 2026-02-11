import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { map, of } from 'rxjs';

import UserManagementDetailComponent from './detail/user-management-detail.component';
import UserManagementComponent from './table/user-management.component';
import { UserManagementModel } from './user-management.model';
import { UserManagementService } from './user-management.service';

export const UserManagementResolve: ResolveFn<UserManagementModel | null> = (
  route: ActivatedRouteSnapshot,
) => {
  const id = route.paramMap.get('id');
  if (id) {
    return inject(UserManagementService)
      .find(Number(id))
      .pipe(
        // The backend returns a User, but we want to return an Authentication, so we need to map the response.
        // This is a bit of a hack, but it allows us to reuse the same components for both the user management and the account management.
        // In a real application, we would probably want to have separate components for the user management and the account management.
        map((response) => {
          const user = response.body;
          return user;
        }),
      );
  }
  return of(null);
};

const userManagementRoute: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: ':login/view',
    component: UserManagementDetailComponent,
    resolve: {
      account: UserManagementResolve,
    },
  },
];

export default userManagementRoute;

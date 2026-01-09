import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrivilege } from 'app/entities/models/nk-privilege.model';
import { PrivilegeService } from '../service/nk-privilege.service';

const privilegeResolve = (route: ActivatedRouteSnapshot): Observable<null | IPrivilege> => {
  const id = route.params['id'];
  if (id) {
    return inject(PrivilegeService)
      .find(id)
      .pipe(
        mergeMap((privilege: HttpResponse<IPrivilege>) => {
          if (privilege.body) {
            return of(privilege.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default privilegeResolve;

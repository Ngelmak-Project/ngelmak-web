import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccount } from 'app/entities/models/nk-account.model';
import { AccountService } from '../nk-account.service';

const nkAccountResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccount> => {
  const id: number = Number(route.params['id'].split('-')[0]);
  if (id) {
    return inject(AccountService)
      .find(id)
      .pipe(
        mergeMap((nkAccount: HttpResponse<IAccount>) => {
          if (nkAccount.body) {
            return of(nkAccount.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default nkAccountResolve;

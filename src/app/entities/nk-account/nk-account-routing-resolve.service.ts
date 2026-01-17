import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccount } from 'app/entities/models/nk-account.model';
import { AccountService } from './nk-account.service';

const accountResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccount> => {
  const id: number = Number(route.params['id'].split('-')[0]);
  if (id) {
    return inject(AccountService)
      .find(id)
      .pipe(
        mergeMap((account: HttpResponse<IAccount>) => {
          if (account.body) {
            return of(account.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default accountResolve;

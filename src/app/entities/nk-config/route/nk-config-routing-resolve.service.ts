import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConfigService } from 'app/entities/nk-config/service/nk-config.service';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConfig } from 'app/entities/models/nk-config.model';

const configResolve = (route: ActivatedRouteSnapshot): Observable<null | IConfig> => {
  const id = route.params['id'];
  if (id) {
    return inject(ConfigService)
      .find(id)
      .pipe(
        mergeMap((config: HttpResponse<IConfig>) => {
          if (config.body) {
            return of(config.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default configResolve;

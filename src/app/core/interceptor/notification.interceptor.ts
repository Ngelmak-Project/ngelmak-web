import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AlertService } from 'app/shared/alert/alert.service';

export const notificationInterceptor: HttpInterceptorFn = (request, next) => {
  const alertService = inject(AlertService);

  return next(request).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        let alert: string | null = null;
        let alertParams: string | null = null;

        for (const headerKey of event.headers.keys()) {
          if (headerKey.toLowerCase().endsWith('app-alert')) {
            alert = event.headers.get(headerKey);
          } else if (headerKey.toLowerCase().endsWith('app-params')) {
            alertParams = decodeURIComponent(event.headers.get(headerKey)!.replace(/\+/g, ' '));
          }
        }

        if (alert) {
          alertService.addAlert({
            type: 'success',
            translationKey: alert,
            translationParams: { param: alertParams },
          });
        }
      }
    })
  );
};

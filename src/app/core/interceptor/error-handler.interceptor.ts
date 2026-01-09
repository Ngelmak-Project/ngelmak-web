import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (request, next) => {
  const eventManager = inject(EventManager);

  return next(request).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (!(err.status === 401 && (err.message === '' || err.url?.includes('api/account')))) {
          eventManager.broadcast(new EventWithContent('ngelmakprojectApp.httpError', err));
        }
      },
    })
  );
};

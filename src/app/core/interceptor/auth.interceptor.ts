import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthServerProvider } from '../auth/auth-jwt.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateStorageService = inject(StateStorageService);
  const apiConfigService = inject(ApiConfigService);
  const authService = inject(AuthServerProvider);

  const serverApiUrl = apiConfigService.buildApiUrl();

  // Skip external URLs
  if (
    !req.url ||
    (req.url.startsWith('http') && !(serverApiUrl && req.url.startsWith(serverApiUrl)))
  ) {
    return next(req);
  }

  // Get token asynchronously and attach it
  return from(stateStorageService.getAuthenticationToken()).pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }

      return next(req).pipe(
        catchError((error) => {
          if (error.status === 401 && error.error?.errorCode === 'TOKEN_EXPIRED') {
            if (!isRefreshing) {
              isRefreshing = true;

              return authService.refreshToken().pipe(
                switchMap(() =>
                  from(stateStorageService.getAuthenticationToken()).pipe(
                    switchMap((newToken) => {
                      isRefreshing = false;

                      const retryReq = req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` },
                      });

                      return next(retryReq);
                    })
                  )
                ),
                catchError((refreshError) => {
                  isRefreshing = false;
                  return throwError(() => refreshError);
                })
              );
            }

            return throwError(() => error);
          }

          return throwError(() => error);
        })
      );
    })
  );
};

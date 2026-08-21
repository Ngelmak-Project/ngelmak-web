import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { BehaviorSubject, catchError, from, switchMap, throwError } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthServerProvider } from '../auth/auth-jwt.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

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

  return from(stateStorageService.getAuthenticationToken()).pipe(
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }

      return next(req).pipe(
        catchError((error) => {
          const expired = error.status === 401 && error.error?.errorCode === 'TOKEN_EXPIRED';

          if (!expired) {
            // Normal error, then do not wait, do not retry
            return throwError(() => error);
          }

          // This request FAILED, then it must retry after refresh
          return retryAfterRefresh(req, next, authService, stateStorageService);
        })
      );
    })
  );
};

function retryAfterRefresh(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthServerProvider,
  stateStorageService: StateStorageService
) {
  if (!isRefreshing) {
    // Start refresh
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() =>
        from(stateStorageService.getAuthenticationToken()).pipe(
          switchMap((newToken) => {
            isRefreshing = false;
            refreshTokenSubject.next(newToken);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next(retryReq);
          })
        )
      ),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  // Refresh already ongoing, this failed request must wait
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => {
      const retryReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(retryReq);
    })
  );
}

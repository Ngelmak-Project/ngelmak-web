import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApiConfigService } from 'app/core/config/api-config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateStorageService = inject(StateStorageService);
  const serverApiUrl = inject(ApiConfigService).buildApiUrl(null, null);

  // Skip if URL is external or empty
  if (
    !req.url ||
    (req.url.startsWith('http') && !(serverApiUrl && req.url.startsWith(serverApiUrl)))
  ) {
    return next(req);
  }

  const token = stateStorageService.getAuthenticationToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};

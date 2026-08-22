import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { filter, map, take } from 'rxjs';
import { StateStorageService } from '../storage/state-storage.service';

export const UserRouteAccessService: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    filter((ready) => ready),
    take(1),
    map(() => {
      const auth = authService.authentication();

      if (auth) {
        const authorities = next.data['authorities'];
        const allowed =
          !authorities || authorities.length === 0 || authService.hasAnyAuthority(authorities);

        return allowed ? true : router.parseUrl('/accessdenied');
      }

      void stateStorageService.storeUrl(state.url);
      return router.parseUrl('/sign-in');
    })
  );
};

import { inject, isDevMode } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from 'app/core/auth/auth.service';
import { StateStorageService } from '../storage/state-storage.service';
export const UserRouteAccessService: CanActivateFn = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);

  const auth = authService.authentication(); // read the signal synchronously

  if (auth) {
    const authorities = next.data['authorities'];

    const allowed =
      !authorities || authorities.length === 0 || authService.hasAnyAuthority(authorities);

    if (allowed) {
      return true;
    }

    if (isDevMode()) {
      console.error('User does not have required authorities:', authorities);
    }

    return router.parseUrl('/accessdenied');
  }

  // Not authenticated
  await stateStorageService.storeUrl(state.url);
  return router.parseUrl('/sign-in');
};

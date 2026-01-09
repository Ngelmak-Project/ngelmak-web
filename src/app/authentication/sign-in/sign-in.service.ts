import { inject, Injectable } from '@angular/core';
import { Authentication } from 'app/core/auth/auth.model';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { mergeMap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignInService {
  private authService = inject(AuthenticationService);
  private authServerProvider = inject(AuthServerProvider);

  signIn(credentials): Observable<Authentication> {
    return this.authServerProvider
      .signIn(credentials)
      .pipe(mergeMap(() => this.authService.identity(true)));
  }

  signOut(): void {
    this.authServerProvider
      .signOut()
      .subscribe({ complete: () => this.authService.authenticate(null) });
  }
}

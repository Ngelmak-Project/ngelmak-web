import { inject, Injectable } from '@angular/core';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignInService {
  private authService = inject(AuthenticationService);
  private authServerProvider = inject(AuthServerProvider);

  /**
   * After login, refresh authentication
   *
   * @param credentials
   * @returns
   */
  signIn(credentials): Observable<void> {
    return this.authServerProvider.signIn(credentials).pipe(
      tap(() => this.authService.loadAuthentication()),
      map(() => void 0),
    );
  }

  signOut(): void {
    this.authServerProvider
      .signOut()
      .subscribe({ complete: () => this.authService.authenticate(null) });
  }
}

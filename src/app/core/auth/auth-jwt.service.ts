import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SignInModel } from 'app/authentication/sign-in/sign-in.model';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { StateStorageService } from './state-storage.service';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private http = inject(HttpClient);
  private storage = inject(StateStorageService);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('auth', 'login');

  /**
   * Returns the stored JWT token or an empty string if none exists.
   */
  getToken(): string {
    return this.storage.getAuthenticationToken() ?? '';
  }

  /**
   * Authenticates the user with the backend.
   * Stores the JWT token on success.
   */
  signIn(credentials: SignInModel): Observable<void> {
    return this.http.post<JwtToken>(this.resourceUrl, credentials).pipe(
      tap(({ id_token }) =>
        this.storage.storeAuthenticationToken(id_token, credentials.rememberMe)
      ),
      map(() => void 0),
    );
  }

  /**
   * Clears the authentication token.
   * Returns an observable for guard compatibility.
   */
  signOut(): Observable<void> {
    this.storage.clearAll();
    return of(void 0);
  }
}

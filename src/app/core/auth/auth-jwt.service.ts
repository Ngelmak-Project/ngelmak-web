import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignInModel } from 'app/authentication/sign-in/sign-in.model';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StateStorageService } from '../storage/state-storage.service';
import { LoginResponseDTO } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private http = inject(HttpClient);
  private storage = inject(StateStorageService);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('auth');

  /**
   * Authenticates the user with the backend.
   * Stores the JWT token on success.
   */
  signIn(credentials: SignInModel): Observable<void> {
    return this.http
      .post<LoginResponseDTO>(`${this.resourceUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        switchMap(({ accessToken, refreshToken }) =>
          from(this.storage.storeAuthenticationToken(accessToken, refreshToken))
        ),
        map(() => void 0)
      );
  }

  refreshToken(): Observable<void> {
    return from(this.storage.getRefreshToken()).pipe(
      switchMap((refreshToken) =>
        this.http.post<LoginResponseDTO>(
          `${this.resourceUrl}/refresh`,
          { refreshToken },
          { withCredentials: true }
        )
      ),
      switchMap(({ accessToken, refreshToken }) =>
        from(this.storage.storeAuthenticationToken(accessToken, refreshToken))
      ),
      map(() => void 0)
    );
  }

  /**
   * Clears the authentication token.
   * Returns an observable for guard compatibility.
   */
  signOut(): Observable<void> {
    return from(this.storage.getRefreshToken()).pipe(
      switchMap((refreshToken) =>
        this.http.post<LoginResponseDTO>(
          `${this.resourceUrl}/logout`,
          { refreshToken },
          { withCredentials: true }
        )
      ),
      switchMap(() => from(this.storage.clearAll())),
      map(() => void 0)
    );
  }
}

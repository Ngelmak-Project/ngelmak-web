import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Authentication } from 'app/core/auth/auth.model';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /**
   * Holds the current authenticated user.
   * Null means "not authenticated".
   */
  private readonly _auth = signal<Authentication | null>(null);

  /**
   * Public readonly signal for components.
   * Components should never mutate authentication directly.
   */
  readonly authentication = this._auth.asReadonly();

  private http = inject(HttpClient);
  private router = inject(Router);
  private stateStorage = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);

  constructor() {
    // Automatically load authentication on startup
    this.loadAuthentication();
  }

  /**
   * Saves a new user registration.
   */
  save(auth: Authentication): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('auth/register'), auth);
  }

  /**
   * Requests official certification for the current user.
   */
  requestCertification(request: {
    officialDocType: string;
    officialDocIdentification: string;
  }): Observable<{}> {
    return this.http.put(this.applicationConfigService.getEndpointFor('auth/certifications/request'), request, {
      observe: 'response',
    });
  }

  /**
   * Updates the current authentication state.
   * Passing null logs the user out.
   */
  authenticate(auth: Authentication | null): void {
    this._auth.set(auth);
  }

  /**
   * Loads the authenticated user from the backend.
   * This is automatically called on service creation.
   */
  loadAuthentication(): void {
    this.http.get<Authentication>(this.applicationConfigService.getEndpointFor('auth/me')).subscribe({
      next: (auth) => {
        this._auth.set(auth);
        this.navigateToStoredUrl();
      },
      error: () => this._auth.set(null),
    });
  }

  /**
   * Returns true if a user is authenticated.
   */
  isAuthenticated(): boolean {
    return this._auth() !== null;
  }

  /**
   * Checks if the user has at least one of the given authorities.
   */
  hasAnyAuthority(authorities: string[] | string): boolean {
    const auth = this._auth();
    if (!auth) return false;

    const required = Array.isArray(authorities) ? authorities : [authorities];
    return auth.authorities.some((a) => required.includes(a));
  }

  /**
   * Navigates to the URL stored before authentication.
   */
  private navigateToStoredUrl(): void {
    const previousUrl = this.stateStorage.getUrl();
    if (previousUrl) {
      this.stateStorage.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

import { Authentication } from 'app/core/auth/auth.model';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userIdentity = signal<Authentication | null>(null);
  private authenticationState = new ReplaySubject<Authentication | null>(1);
  private authCache$?: Observable<Authentication> | null;

  private http = inject(HttpClient);
  private router = inject(Router);
  private stateStorageService = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);

  save(auth: Authentication): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('auth/register'), auth);
  }

  requestCertification(request: { officialDocType; officialDocIdentification }): Observable<{}> {
    return this.http.put(
      this.applicationConfigService.getEndpointFor('auth/certifications/request'),
      request,
      {
        observe: 'response',
      }
    );
  }

  authenticate(identity: Authentication | null): void {
    this.userIdentity.set(identity);
    this.authenticationState.next(this.userIdentity());
    if (!identity) {
      this.authCache$ = null;
    }
  }

  trackCurrentAuthentication(): Signal<Authentication | null> {
    return this.userIdentity.asReadonly();
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    const userIdentity = this.userIdentity();
    if (!userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Authentication | null> {
    if (!this.authCache$ || force) {
      this.authCache$ = this.fetchUserAuthentication().pipe(
        tap((auth: Authentication) => {
          this.authenticate(auth);
          // After retrieve the auth info, the language will be changed to
          // the user's preferred language configured in the auth setting
          // unless user have choosed other language in the current session
          // if (!this.stateStorageService.getLocale()) {
          //   this.translateService.use(auth.langKey);
          // }
          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.authCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity() !== null;
  }

  getAuthenticationState(): Observable<Authentication | null> {
    return this.authenticationState.asObservable();
  }

  private fetchUserAuthentication(): Observable<Authentication> {
    return this.http.get<Authentication>(
      this.applicationConfigService.getEndpointFor('auth/me')
    );
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}

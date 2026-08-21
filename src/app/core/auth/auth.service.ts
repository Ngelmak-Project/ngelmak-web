import { inject, Injectable, signal } from '@angular/core';
import { Authentication } from 'app/core/auth/auth.model';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { UserUpdateDTO } from 'app/user-management/security/user.model';
import { UserService } from 'app/user-management/security/user.service';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userService = inject(UserService);
  private storage = inject(StateStorageService);

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

  private authReady = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReady.asObservable();

  constructor() {
    this.loadAuthentication().subscribe(() => {
      this.authReady.next(true);
    });
  }

  updateUser(user: UserUpdateDTO): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.userService
      .update(user)
      .pipe(switchMap(({ body }) => from(this.storage.storeUser(body)).pipe(map(() => body))))
      .subscribe({
        next: (updatedUser) => {
          this.setAuthentication(updatedUser);
        },
        error: () => {
          // Handle the update error [TODO]
        },
      });
  }

  /**
   * Updates the current authentication state.
   * Passing null logs the user out.
   */
  setAuthentication(auth: Authentication | null): void {
    this._auth.set(auth);
  }

  /**
   * How long we consider the cached authentication valid.
   * Example: 10 minutes.
   */
  private readonly AUTH_MAX_AGE = 1 * 60 * 1000;

  /**
   * Last time we successfully loaded authentication from backend.
   */
  private lastBackendLoad = 0;

  loadAuthentication(): Observable<Authentication | null> {
    const currentAuth = this._auth();

    // If already authenticated AND cache is fresh → return it
    if (currentAuth && !this.isAuthStale()) {
      return of(currentAuth);
    }

    return from(this.storage.getAuthenticationToken()).pipe(
      switchMap((token) => {
        // No token → do NOT call backend
        if (!token) {
          return of(null);
        }

        // Try loading user from storage
        return from(this.storage.getUser()).pipe(
          switchMap((storedUser) => {
            if (storedUser && !this.isAuthStale()) {
              this.setAuthentication(storedUser);
              return of(storedUser);
            }

            // Token exists → backend call is allowed
            return this.userService.profile().pipe(
              tap(({ body }) => {
                this.lastBackendLoad = Date.now();
                this.setAuthentication(body);
                void this.storage.storeUser(body);
              }),
              map(({ body }) => body),
              catchError((erro) => {
                // Everything failed → clean unauthenticated state
                this.setAuthentication(null);
                this.storage.clearUser();
                return of(null);
              })
            );
          })
        );
      })
    );
  }

  /**
   * Returns true if the cached authentication is too old.
   */
  private isAuthStale(): boolean {
    return Date.now() - this.lastBackendLoad > this.AUTH_MAX_AGE;
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
}

import { inject, Injectable, signal } from '@angular/core';
import { Authentication } from 'app/core/auth/auth.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { UserUpdateDTO } from 'app/user-management/security/user.model';
import { UserService } from 'app/user-management/security/user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userService = inject(UserService);
  private alertServie = inject(AlertService);

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

  constructor() {
    // Automatically load authentication on startup
    this.loadAuthentication();
  }

  updateUser(user: UserUpdateDTO): void {
    if (!this.isAuthenticated()) return;

    this.userService.update(user).subscribe(({ body }) => this._auth.set(body));
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
   *
   * This is automatically called on service creation.
   */
  loadAuthentication(): void {
    this.userService.profile().subscribe({
      next: ({ body }) => {
        this._auth.set(body);
        if (body.isActivated === false) {
          this.alertServie.addAlert({
            type: 'warning',
            translationKey: 'ngelmakTranslation.auth.signIn.alerts.userNotActivated',
            message:
              "Votre compte n'est pas encore activé.\nVeuillez vérifier votre boîte mail pour le lien d'activation.",
            timeout: 10000,
          });
        }
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
}

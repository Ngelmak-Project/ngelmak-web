import { HttpClient, HttpResponse } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccount } from 'app/entities/models/nk-account.model';
import { AuthenticationService } from 'app/core/auth/auth.service';

export type EntityResponseType = HttpResponse<IAccount>;
export type EntityArrayResponseType = HttpResponse<IAccount[]>;


// [TODO] Make sure the account of the current user is saved locally to avoid back and forth fetch from the server.

@Injectable({ providedIn: 'root' })
export class AccountService {
  /**
   * Holds the current user's account.
   * Null means "no authenticated user" or "account not loaded".
   */
  private readonly _account = signal<IAccount | null>(null);

  /**
   * Public readonly signal for components.
   */
  readonly account = this._account.asReadonly();

  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);
  private authService = inject(AuthenticationService);

  private resourceUrl = this.applicationConfigService.getEndpointFor('core/accounts');

  constructor() {
    /**
     * React to authentication changes.
     * When the user logs in → fetch account.
     * When the user logs out → clear account.
     */
    effect(() => {
      const auth = this.authService.authentication();
      if (auth) {
        this.loadAccount();
      } else {
        this._account.set(null);
      }
    });
  }

  /**
   * Fetches the current user's account from the backend.
   * Called automatically when authentication changes.
   */
  private loadAccount(): void {
    this.http.get<IAccount>(`${this.resourceUrl}/me`).subscribe({
      next: (acc) => this._account.set(acc),
      error: () => this._account.set(null),
    });
  }

  /**
   * Allows manual updates to the account (e.g., after editing profile).
   */
  updateLocalAccount(account: IAccount): void {
    this._account.set(account);
  }

  /**
   * CRUD operations for accounts (admin or profile editing).
   */
  create(account: IAccount): Observable<EntityResponseType> {
    return this.http.post<IAccount>(this.resourceUrl, account, {
      observe: 'response',
    });
  }

  update(account: IAccount): Observable<EntityResponseType> {
    console.log(account);

    return this.http.put<IAccount>(this.resourceUrl, account, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByUser(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/user/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccount[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  updateAvatar(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<IAccount>(`${this.resourceUrl}/upload-avatar`, data, {
      observe: 'response',
    });
  }

  updateBanner(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<IAccount>(`${this.resourceUrl}/upload-banner`, data, {
      observe: 'response',
    });
  }
}

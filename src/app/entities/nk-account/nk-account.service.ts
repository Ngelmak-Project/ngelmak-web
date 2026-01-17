import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccount } from 'app/entities/models/nk-account.model';
import { IHttpRestApiService } from '../entity.service';

export type EntityResponseType = HttpResponse<IAccount>;
export type EntityArrayResponseType = HttpResponse<IAccount[]>;

@Injectable({ providedIn: 'root' })
export class AccountService implements IHttpRestApiService<IAccount> {
  private account = signal<IAccount | null>(null);
  private accountCache$?: Observable<IAccount> | null;

  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/accounts');

  trackCurrentAccount(): Signal<IAccount | null> {
    if (this.account() == null && !this.accountCache$) {
      this.currentAccount().subscribe();
    }
    return this.account.asReadonly();
  }

  currentAccount(force?: boolean): Observable<IAccount | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.findByCurrentUser().pipe(
        tap((account: IAccount) => {
          this.account.set(account);
          if (!account) {
            this.accountCache$ = null;
          }
        })
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  setAccount(account: IAccount): void {
    this.account.set(account);
    if (!account) {
      this.accountCache$ = null;
    }
  }

  findByCurrentUser(): Observable<IAccount> {
    return this.http.get<IAccount>(`${this.resourceUrl}/me`);
  }

  create(account: IAccount): Observable<EntityResponseType> {
    return this.http.post<IAccount>(this.resourceUrl, account, {
      observe: 'response',
    });
  }

  update(account: IAccount): Observable<EntityResponseType> {
    return this.http.put<IAccount>(this.resourceUrl, account, {
      observe: 'response',
    });
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

  partialUpdate(account: IAccount): Observable<EntityResponseType> {
    return this.http.patch<IAccount>(`${this.resourceUrl}/${account.id}`, account, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByUser(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/user/${id}`, {
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccount[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}

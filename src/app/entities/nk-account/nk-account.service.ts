import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, signal, Signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IAccount } from "app/entities/models/nk-account.model";
import { IHttpRestApiService } from "../entity.service";

export type EntityResponseType = HttpResponse<IAccount>;
export type EntityArrayResponseType = HttpResponse<IAccount[]>;

@Injectable({ providedIn: "root" })
export class AccountService implements IHttpRestApiService<IAccount> {
  private nkAccount = signal<IAccount | null>(null);
  private nkAccountCache$?: Observable<IAccount> | null;

  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("core/accounts");

  trackCurrentAccount(): Signal<IAccount | null> {
    return this.nkAccount.asReadonly();
  }

  currentAccount(force?: boolean): Observable<IAccount | null> {
    if (!this.nkAccountCache$ || force) {
      this.nkAccountCache$ = this.findByCurrentUser().pipe(
        tap((nkAccount: IAccount) => {
          this.nkAccount.set(nkAccount);
          if (!nkAccount) {
            this.nkAccountCache$ = null;
          }
        })
      );
    }
    return this.nkAccountCache$.pipe(catchError(() => of(null)));
  }

  setNkAccount(nkAccount: IAccount): void {
    this.nkAccount.set(nkAccount);
    if (!nkAccount) {
      this.nkAccountCache$ = null;
    }
  }

  findByCurrentUser(): Observable<IAccount> {
    return this.http.get<IAccount>(`${this.resourceUrl}/me`);
  }

  create(nkAccount: IAccount): Observable<EntityResponseType> {
    return this.http.post<IAccount>(this.resourceUrl, nkAccount, {
      observe: "response",
    });
  }

  update(nkAccount: IAccount): Observable<EntityResponseType> {
    return this.http.put<IAccount>(this.resourceUrl, nkAccount, {
      observe: "response",
    });
  }

  updateAvatar(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append("file", file);
    return this.http.put<IAccount>(
      `${this.resourceUrl}/upload-avatar`,
      data,
      {
        observe: "response",
      }
    );
  }

  updateBanner(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append("file", file);
    return this.http.put<IAccount>(
      `${this.resourceUrl}/upload-banner`,
      data,
      {
        observe: "response",
      }
    );
  }

  partialUpdate(nkAccount: IAccount): Observable<EntityResponseType> {
    return this.http.patch<IAccount>(
      `${this.resourceUrl}/${nkAccount.id}`,
      nkAccount,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  findByUser(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccount>(`${this.resourceUrl}/user/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccount[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Authentication } from 'app/core/auth/auth.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IPage } from 'app/shared/pagination/pagination.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  private resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');

  create(account: Authentication): Observable<Authentication> {
    return this.http.post<Authentication>(this.resourceUrl, account);
  }

  update(account: Authentication): Observable<Authentication> {
    return this.http.put<Authentication>(this.resourceUrl, account);
  }

  find(login: string): Observable<Authentication> {
    return this.http.get<Authentication>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IPage<Authentication>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<Authentication>>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http
      .get<Array<{ name: string }>>(this.applicationConfigService.getEndpointFor('api/authorities'))
      .pipe(map(authorities => authorities.map(a => a.name)));
  }

  certificate(request: {
    officialDocType;
    officialDocIdentification;
  }): Observable<HttpResponse<Authentication>> {
    return this.http.put<Authentication>(`${this.resourceUrl}/certification`, request, { observe: 'response' });
  }

  certificationWithdrawal(login): Observable<HttpResponse<Authentication>> {
    return this.http.put<Authentication>(`${this.resourceUrl}/certification-withdrawal/${login}`, {}, { observe: 'response' });
  }

  getAuthenticationCertification(login: string): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/certification/${login}`, { observe: 'response' });
  }
}

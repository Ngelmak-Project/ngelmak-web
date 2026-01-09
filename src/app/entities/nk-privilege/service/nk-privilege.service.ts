import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IPrivilege, UserPrivilege } from "app/entities/models/nk-privilege.model";

export type EntityResponseType = HttpResponse<IPrivilege>;
export type EntityArrayResponseType = HttpResponse<IPrivilege[]>;

@Injectable({ providedIn: "root" })
export class PrivilegeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("core/privileges");

  grant(
    userPrivilege: UserPrivilege
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, userPrivilege, {
      observe: "response",
    });
  }

  revoke(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/revoke/${id}`, {
      observe: "response",
    });
  }

  assign(id: number): Observable<HttpResponse<{}>> {
    return this.http.put(`${this.resourceUrl}/assign/${id}`, null, {
      observe: "response",
    });
  }

  findByLogin(login: string): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.resourceUrl}/${login}`, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPrivilege>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrivilege[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }
}

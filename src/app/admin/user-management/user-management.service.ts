import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IPage } from 'app/shared/pagination/pagination.model';
import { Observable } from 'rxjs';
import { IContactMessage, IUser } from './user-management.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApiConfigService);
  private userResourceUrl = this.applicationConfigService.buildApiUrl('auth', 'admin/users');
  private managementResourceUrl = this.applicationConfigService.buildApiUrl('auth', 'admin');

  /**
   * Find a user by id.
   * @param id of user to find.
   */
  find(id: number): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.userResourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  /**
   * Query for a list of users with pagination and sorting.
   * @param req Pagination and sorting information
   */
  query(req?: Pagination): Observable<HttpResponse<IPage<IUser>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IUser>>(this.userResourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  /**
   * Search for users whose name, login or email contains the query string, with pagination and sorting.
   * @param req Pagination and sorting information
   */
  search(req?: Pagination): Observable<HttpResponse<IPage<IUser>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IUser>>(this.userResourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  /**
   * Activate or deactivate a user. Deactivated users cannot log in.
   * @param id of the user to activate or deactivate
   * @param activated whether the user should be activated or deactivated
   */
  setActive(id: number, activated: boolean): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/active`,
      { id, activated },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Grant authorities to a user.
   * @param id of the user to which to grant authorities
   * @param authorityNames the names of the authorities to grant
   * @returns the updated user with granted authorities
   */
  grantAuthorities(
    id: number,
    authorityNames: string[],
  ): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/authorities/grant`,
      { id, authorityNames },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Revoke authorities from a user.
   * @param id of the user from which to revoke authorities
   * @param authorityNames the names of the authorities to revoke
   * @returns the updated user with revoked authorities
   */
  revokeAuthorities(
    id: number,
    authorityNames: string[],
  ): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/authorities/revoke`,
      { id, authorityNames },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Block a user.
   */
  blockUser(id: number): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/block`,
      { id },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Unblock a user.
   */
  unblockUser(id: number): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/unblock`,
      { id },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Update the certification information of a user.
   */
  certificate(
    id: number,
    docType: string,
    docIdentification: string,
  ): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/certification`,
      { id, docType, docIdentification },
      {
        observe: 'response',
      },
    );
  }

  /**
   * Withdraw certification for a user.
   * @param id of the user for which to withdraw certification
   */
  certificationWithdrawal(id: number): Observable<HttpResponse<IUser>> {
    return this.http.put<IUser>(
      `${this.userResourceUrl}/certification/withdrawal/${id}`,
      {},
      { observe: 'response' },
    );
  }

  /**
   * Query for a list of contacts with pagination and sorting.
   * @param req Pagination and sorting information
   */
  findContacts(req?: Pagination): Observable<HttpResponse<IPage<IContactMessage>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IContactMessage>>(`${this.managementResourceUrl}/contacts`, {
      params: options,
      observe: 'response',
    });
  }

  /**
   * API call for closing a massage.
   * @param id of the message to close.
   */
  closeContact(id: number): Observable<HttpResponse<IContactMessage>> {
    return this.http.put<IContactMessage>(
      `${this.managementResourceUrl}/contacts/close/${id}`,
      {},
      { observe: 'response' },
    );
  }
}

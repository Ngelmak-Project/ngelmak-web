import { EmailUpdateDTO, LoginUpdateDTO, PasswordChangeDTO, UserUpdateDTO } from './user.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Authentication } from 'app/core/auth/auth.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('auth/user');

  /**
   * Updates user profile information through a dedicated endpoint.
   *
   * @param userUpdate data transfer object containing user profile update information
   * @returns
   */
  update(userUpdate: UserUpdateDTO): Observable<any> {
    return this.http.put<Authentication>(`${this.resourceUrl}/update`, userUpdate, {
      observe: 'response',
    });
  }

  /**
   * Initiates a secure password change process for the user's account.
   *
   * @param passwordChangeDTO data transfer object for password modification
   * @returns
   */
  changePassword(passwordChangeDTO: PasswordChangeDTO): Observable<any> {
    return this.http.post<Authentication>(
      `${this.resourceUrl}/change-password`,
      passwordChangeDTO,
      {
        observe: 'response',
      },
    );
  }

  /**
   * Update email for the connected user.
   *
   * @param emailUpdateDTO data transfer object for email modification
   * @returns
   */
  updateEmail(emailUpdateDTO: EmailUpdateDTO): Observable<any> {
    return this.http.post<Authentication>(`${this.resourceUrl}/update-email`, emailUpdateDTO, {
      observe: 'response',
    });
  }

  /**
   * Update login for the connected user.
   *
   * @param loginUpdateDTO data transfer object for login modification
   * @returns
   */
  updateLogin(loginUpdateDTO: LoginUpdateDTO): Observable<any> {
    return this.http.post<Authentication>(`${this.resourceUrl}/update-login`, loginUpdateDTO, {
      observe: 'response',
    });
  }

  /**
   * Uploads and updates the user's profile avatar/profile image.
   *
   * @param file image file selected for upload
   * @returns
   */
  uploadImage(file: File): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<Authentication>(`${this.resourceUrl}/upload-avatar`, data, {
      observe: 'response',
    });
  }
}

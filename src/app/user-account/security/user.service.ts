import { UserUpdateDTO } from './user.model';
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

  update(userUpdate: UserUpdateDTO): Observable<any> {
    return this.http.put<Authentication>(`${this.resourceUrl}/update`, userUpdate, {
      observe: 'response',
    });
  }

  updateImage(file: File): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.put<Authentication>(`${this.resourceUrl}/upload-avatar`, data, {
      observe: 'response',
    });
  }
}

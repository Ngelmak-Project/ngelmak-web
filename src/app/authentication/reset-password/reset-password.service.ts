import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  updatePasswor(key: string, newPassword: string): Observable<void> {
    return this.http.post<void>(
      this.applicationConfigService.getEndpointFor('auth/public/auth/reset-password/finish'),
      { key, newPassword },
    );
  }
}

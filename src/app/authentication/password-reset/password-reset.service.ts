import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private http = inject(HttpClient);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('auth', 'password-reset/finish');

  updatePasswor(key: string, newPassword: string): Observable<void> {
    return this.http.post<void>(
      this.resourceUrl,
      { key, newPassword },
    );
  }
}

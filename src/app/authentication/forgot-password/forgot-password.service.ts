import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class ForgetPasswordService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  passwordReset(email: string): Observable<void> {
    return this.http.post<void>(
      this.applicationConfigService.getEndpointFor('auth/public/auth/reset-password/init'),
      { email },
    );
  }
}

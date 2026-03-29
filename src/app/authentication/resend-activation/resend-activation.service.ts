import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class ForgetPasswordService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  /**
   * Resend activation email to the user.
   * @param email The email address of the user to resend the activation email to.
   */
  resendActivation(email: string): Observable<void> {
    return this.http.post<void>(
      this.applicationConfigService.getEndpointFor('auth/public/auth/activate/resend'),
      { email },
    );
  }
}

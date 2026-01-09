import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SignupModel } from './sign-up.model';

@Injectable({ providedIn: 'root' })
export class SignUpService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  save(signup: SignupModel): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor('api/register'), signup);
  }
}

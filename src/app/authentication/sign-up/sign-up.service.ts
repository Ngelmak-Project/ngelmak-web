import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';
import { SignupModel } from './sign-up.model';

@Injectable({ providedIn: 'root' })
export class SignUpService {
  private http = inject(HttpClient);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('auth', 'register');

  save(signup: SignupModel): Observable<void> {
    return this.http.post<void>(this.resourceUrl, signup);
  }
}

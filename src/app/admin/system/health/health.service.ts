import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';
import { Health } from './health.model';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);
  private resourceUrl = inject(ApiConfigService).buildApiUrl('management', 'health');

  checkHealth(): Observable<Health> {
    return this.http.get<Health>(this.resourceUrl);
  }
}

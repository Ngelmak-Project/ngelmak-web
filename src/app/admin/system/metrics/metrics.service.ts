import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';
import { Metrics, ThreadDump } from './metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApiConfigService);

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(this.applicationConfigService.buildApiUrl('management', 'ngelmakmetrics'));
  }

  threadDump(): Observable<ThreadDump> {
    return this.http.get<ThreadDump>(this.applicationConfigService.buildApiUrl('management', 'threaddump'));
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';
import { Level, LoggersResponse } from './log.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApiConfigService);

  changeLevel(name: string, configuredLevel: Level): Observable<{}> {
    return this.http.post(this.applicationConfigService.buildApiUrl('management', `loggers/${name}`), { configuredLevel });
  }

  findAll(): Observable<LoggersResponse> {
    return this.http.get<LoggersResponse>(this.applicationConfigService.buildApiUrl('management', 'loggers'));
  }
}

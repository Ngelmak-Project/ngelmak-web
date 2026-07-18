import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivateService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApiConfigService).buildApiUrl('auth', 'activate');

  get(key: string): Observable<{}> {
    return this.http.get(this.resourceUrl, {
      params: new HttpParams().set('key', key),
    });
  }
}

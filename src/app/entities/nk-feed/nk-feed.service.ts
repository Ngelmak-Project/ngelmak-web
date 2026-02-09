import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFeed, IFeedDTO } from './../models/nk-feed.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPage } from 'app/shared/pagination/pagination.model';

export type EntityResponseType = HttpResponse<IFeed>;
export type EntityArrayResponseType = HttpResponse<IFeed[]>;

@Injectable({ providedIn: 'root' })
export class FeedService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/feeds');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('core/r/feeds');

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFeed>(`${this.publicResourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findByChannel(id: number, req?: any): Observable<HttpResponse<IPage<IFeed>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IFeed>>(`${this.resourceUrl}/me/${id}`, {
      params: options,
      observe: 'response',
    });
  }

  search(req?: any): Observable<HttpResponse<IPage<IFeed>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IFeed>>(`${this.publicResourceUrl}/search`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<HttpResponse<IPage<IFeedDTO>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IFeedDTO>>(this.publicResourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReview } from 'app/entities/models/nk-review.model';

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/reviews');

  create(review: IReview): Observable<EntityResponseType> {
    return this.http.post<IReview>(this.resourceUrl, review, { observe: 'response' });
  }

  update(review: IReview): Observable<EntityResponseType> {
    return this.http.put<IReview>(this.resourceUrl, review, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReview>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Retrieve all reviews of the given ticket.
   * @param id of the ticket.
   * @returns
   */
  findByTicket(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IReview[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IReview } from 'app/entities/models/nk-review.model';

export type PartialUpdateReview = Partial<IReview> & Pick<IReview, 'id'>;

type RestOf<T extends IReview | IReview> = Omit<T, 'at'> & {
  at?: string | null;
};

export type RestReview = RestOf<IReview>;

export type NewRestReview = RestOf<IReview>;

export type PartialUpdateRestReview = RestOf<PartialUpdateReview>;

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reviews');

  create(review: IReview): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(review);
    return this.http
      .post<RestReview>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(review: IReview): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(review);
    return this.http
      .put<RestReview>(`${this.resourceUrl}/${this.getReviewIdentifier(review)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(review: PartialUpdateReview): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(review);
    return this.http
      .patch<RestReview>(`${this.resourceUrl}/${this.getReviewIdentifier(review)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReview>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReview[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReviewIdentifier(review: Pick<IReview, 'id'>): number {
    return review.id;
  }

  compareReview(o1: Pick<IReview, 'id'> | null, o2: Pick<IReview, 'id'> | null): boolean {
    return o1 && o2 ? this.getReviewIdentifier(o1) === this.getReviewIdentifier(o2) : o1 === o2;
  }

  addReviewToCollectionIfMissing<Type extends Pick<IReview, 'id'>>(
    reviewCollection: Type[],
    ...reviewsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reviews: Type[] = reviewsToCheck.filter(isPresent);
    if (reviews.length > 0) {
      const reviewCollectionIdentifiers = reviewCollection.map(reviewItem => this.getReviewIdentifier(reviewItem));
      const reviewsToAdd = reviews.filter(reviewItem => {
        const reviewIdentifier = this.getReviewIdentifier(reviewItem);
        if (reviewCollectionIdentifiers.includes(reviewIdentifier)) {
          return false;
        }
        reviewCollectionIdentifiers.push(reviewIdentifier);
        return true;
      });
      return [...reviewsToAdd, ...reviewCollection];
    }
    return reviewCollection;
  }

  protected convertDateFromClient<T extends IReview | IReview | PartialUpdateReview>(review: T): RestOf<T> {
    return {
      ...review,
      at: review.at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReview: RestReview): IReview {
    return {
      ...restReview,
      at: restReview.at ? dayjs(restReview.at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReview>): HttpResponse<IReview> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReview[]>): HttpResponse<IReview[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IReview } from 'app/entities/models/nk-review.model';
import { Observable } from 'rxjs';

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  // LOCAL STATE

  private reviews = signal<IReview[]>([]);
  reviews$ = computed(() => this.reviews());

  /**
   * Replace the review list.
   * @param values new review list.
   */
  setReviews(values: IReview[]): void {
    this.reviews.set(values);
  }

  /**
   * Local update of the review list.
   * Only the content field is updated.
   * @param review
   */
  updateLocal(review: IReview): void {
    this.reviews.update((list) =>
      list.map((r) => (r.id === review.id ? { ...r, content: review.content } : r)),
    );
  }

  /**
   * Add a revew at the bottom of the local list.
   * @param review
   */
  addLocal(review: IReview): void {
    this.reviews.update((list) => [...list, review]);
  }

  /**
   * Delete a review from the local list.
   * @param id
   */
  removeLocal(id: number): void {
    this.reviews.update((list) => list.filter((r) => r.id !== id));
  }

  // API

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

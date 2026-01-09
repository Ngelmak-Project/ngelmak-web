import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export declare interface  IHttpRestApiService<T> {
  create(entity: T): Observable<HttpResponse<T>>;

  update(entity: T): Observable<HttpResponse<T>>;

  partialUpdate(entity: T): Observable<HttpResponse<T>>;

  find(id: number): Observable<HttpResponse<T>>;

  query(req?: any): Observable<HttpResponse<T[]>>;

  delete(id: number): Observable<HttpResponse<{}>>;
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from 'app/core/config/api-config.service';
import { Observable } from 'rxjs';
import { IReaction } from './../models/nk-reaction.model';

export type EntityResponseType = HttpResponse<IReaction>;
export type EntityArrayResponseType = HttpResponse<IReaction[]>;

@Injectable({ providedIn: 'root' })
export class ReactionService {
  protected http = inject(HttpClient);
  protected resourceUrl = inject(ApiConfigService).buildApiUrl('core', 'reactions');

  create(reaction: IReaction): Observable<EntityResponseType> {
    return this.http
      .post<IReaction>(this.resourceUrl, reaction, { observe: 'response' });
  }

  update(reaction: IReaction): Observable<EntityResponseType> {
    return this.http
      .put<IReaction>(this.resourceUrl, reaction, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}

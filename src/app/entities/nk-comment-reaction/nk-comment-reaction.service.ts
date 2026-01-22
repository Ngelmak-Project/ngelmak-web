import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReaction } from './../models/nk-reaction.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export type EntityResponseType = HttpResponse<IReaction>;
export type EntityArrayResponseType = HttpResponse<IReaction[]>;

@Injectable({ providedIn: 'root' })
export class ReactionService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('core/reactions');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('core/r/reactions');

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

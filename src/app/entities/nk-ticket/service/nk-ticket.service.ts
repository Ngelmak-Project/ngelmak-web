import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ITicket } from 'app/entities/models/nk-ticket.model';

export type PartialUpdateTicket = Partial<ITicket> & Pick<ITicket, 'id'>;

type RestOf<T extends ITicket | ITicket> = Omit<T, 'at'> & {
  at?: string | null;
};

export type RestTicket = RestOf<ITicket>;

export type NewRestTicket = RestOf<ITicket>;

export type PartialUpdateRestTicket = RestOf<PartialUpdateTicket>;

export type EntityResponseType = HttpResponse<ITicket>;
export type EntityArrayResponseType = HttpResponse<ITicket[]>;

@Injectable({ providedIn: 'root' })
export class TicketService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tickets');

  create(ticket: ITicket): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticket);
    return this.http
      .post<RestTicket>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ticket: ITicket): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticket);
    return this.http
      .put<RestTicket>(`${this.resourceUrl}/${this.getTicketIdentifier(ticket)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ticket: PartialUpdateTicket): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticket);
    return this.http
      .patch<RestTicket>(`${this.resourceUrl}/${this.getTicketIdentifier(ticket)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTicket>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTicket[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketIdentifier(ticket: Pick<ITicket, 'id'>): number {
    return ticket.id;
  }

  compareTicket(o1: Pick<ITicket, 'id'> | null, o2: Pick<ITicket, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketIdentifier(o1) === this.getTicketIdentifier(o2) : o1 === o2;
  }

  addTicketToCollectionIfMissing<Type extends Pick<ITicket, 'id'>>(
    ticketCollection: Type[],
    ...ticketsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tickets: Type[] = ticketsToCheck.filter(isPresent);
    if (tickets.length > 0) {
      const ticketCollectionIdentifiers = ticketCollection.map(ticketItem => this.getTicketIdentifier(ticketItem));
      const ticketsToAdd = tickets.filter(ticketItem => {
        const ticketIdentifier = this.getTicketIdentifier(ticketItem);
        if (ticketCollectionIdentifiers.includes(ticketIdentifier)) {
          return false;
        }
        ticketCollectionIdentifiers.push(ticketIdentifier);
        return true;
      });
      return [...ticketsToAdd, ...ticketCollection];
    }
    return ticketCollection;
  }

  protected convertDateFromClient<T extends ITicket | ITicket | PartialUpdateTicket>(ticket: T): RestOf<T> {
    return {
      ...ticket,
      at: ticket.at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTicket: RestTicket): ITicket {
    return {
      ...restTicket,
      at: restTicket.at ? dayjs(restTicket.at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTicket>): HttpResponse<ITicket> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTicket[]>): HttpResponse<ITicket[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

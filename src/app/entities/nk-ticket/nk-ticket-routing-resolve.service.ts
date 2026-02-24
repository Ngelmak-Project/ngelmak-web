import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TicketService } from './nk-ticket.service';


export const ticketResolve: ResolveFn<ITicket> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const ticketId = route.paramMap.get('id')!;
  if (ticketId) {
    return inject(TicketService).find(Number(ticketId)).pipe(map((value) => value.body));
  }
  return of(null);
};

export default ticketResolve;

import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChannel } from 'app/entities/models/nk-channel.model';
import { ChannelService } from './nk-channel.service';

const channelResolve = (route: ActivatedRouteSnapshot): Observable<null | IChannel> => {
  const id: number = Number(route.params['id'].split('-')[0]);
  if (id) {
    return inject(ChannelService)
      .find(id)
      .pipe(
        mergeMap((channel: HttpResponse<IChannel>) => {
          if (channel.body) {
            return of(channel.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default channelResolve;

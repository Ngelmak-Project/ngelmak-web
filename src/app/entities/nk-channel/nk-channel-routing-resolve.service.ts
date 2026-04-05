import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ChannelService } from './nk-channel.service';

/**
 * Resolve a channel before route activation.
 * Accepts either:
 *   - /:identifier
 *   - /:id
 * They are treated interchangeably.
 */
const channelResolve: ResolveFn<IChannel> = (route, state) => {
  const router = inject(Router);
  const channelService = inject(ChannelService);

  // Accept both "id" and "identifier"
  const param = route.params['identifier'] ?? route.params['id'];

  // If no param provided, try using the locally stored channel
  if (!param) {
    const localChannel = channelService.channel();
    if (localChannel) {
      return of(localChannel);
    }
    router.navigate(['404']);
    return EMPTY;
  }

  // Fetch channel from backend using id/identifier
  return channelService.find(param).pipe(
    mergeMap((response: HttpResponse<IChannel>) => {
      const channel = response.body;
      if (channel) {
        return of(channel);
      }
      router.navigate(['404']);
      return EMPTY;
    }),
  );
};

export default channelResolve;

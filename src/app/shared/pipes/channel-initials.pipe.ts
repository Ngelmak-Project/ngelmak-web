import { Pipe, PipeTransform } from '@angular/core';
import { IChannel } from 'app/entities/models/nk-channel.model';

@Pipe({
  name: 'channelInitials',
  standalone: true,
})
export class ChannelInitialsPipe implements PipeTransform {
  transform(channel: IChannel): string {
    const name = channel?.name?.trim() || '';

    if (!name) return '';

    // Split on spaces, dots, underscores, hyphens
    const parts = name.split(/[\s._-]+/).filter(Boolean);

    // If multiple words: take first letter of first two words
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // Otherwise: take first character of the single word
    return name.charAt(0).toUpperCase();
  }
}

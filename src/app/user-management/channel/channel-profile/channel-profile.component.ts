import { Component, inject } from '@angular/core';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';

@Component({
  selector: 'app-channel-profile',
  imports: [],
  templateUrl: './channel-profile.component.html',
})
export class ChannelProfileComponent {

  activeChannel = inject(ChannelService).channel;

}

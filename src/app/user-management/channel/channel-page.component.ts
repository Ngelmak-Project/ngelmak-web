import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChannelDetailComponent } from 'app/entities/nk-channel/detail/nk-channel-detail.component';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { ChannelViewComponent } from 'app/entities/nk-channel/view/nk-channel-view.component';

@Component({
  standalone: true,
  selector: 'app-channel-page',
  templateUrl: './channel-page.component.html',
  imports: [CommonModule, RouterModule, ChannelDetailComponent, ChannelViewComponent],
})
export class ChannelPageComponent {
  channel = inject(ChannelService).channel;
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IChannel } from 'app/entities/models/nk-channel.model';
import { ChannelService } from '../nk-channel.service';

@Component({
  standalone: true,
  templateUrl: './nk-channel-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ChannelDeleteDialogComponent {
  channel?: IChannel;

  protected channelService = inject(ChannelService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.channelService.delete(id).subscribe(() => {

    });
  }
}

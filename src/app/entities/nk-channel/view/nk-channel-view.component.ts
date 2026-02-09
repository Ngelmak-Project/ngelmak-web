import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { form, max, required, Field } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { ChannelService } from '../nk-channel.service';
import { finalize } from 'rxjs';
import { AlertService } from 'app/shared/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-channel-view',
  templateUrl: './nk-channel-view.component.html',
  imports: [CommonModule, RouterModule, Field],
})
export class ChannelViewComponent {
  isLoading = signal(false);
  isSaving = signal(false);
  channel = inject(ChannelService).channel;
  channelService = inject(ChannelService);
  alertService = inject(AlertService);

  protected channelModel = signal<IChannel>({
    name: '',
    description: '',
  });

  protected channelForm = form(this.channelModel, (p) => {
    required(p.name, { message: 'Le nom de la chaine est obligatoire.' });
    max(p.name, 100, { message: 'Le nom ne doit pas dépasser 100 caractères.' });
  });

  save(): void {
    const channel = this.channelForm().value();
    this.channelService
      .create(channel)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (res) => {
          this.alertService.addAlert({
            type: 'success',
            message: 'Chaine créée avec succès!',
          });
          this.channelService.updateLocalChannel(res.body);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            message: 'Une erreur lors de la création.',
          }),
      });
  }
}

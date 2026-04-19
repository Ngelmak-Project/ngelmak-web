import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Field, form, max, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';
import { ChannelService } from '../nk-channel.service';

@Component({
  standalone: true,
  selector: 'app-channel-overview',
  templateUrl: './nk-channel-overview.component.html',
  imports: [CommonModule, RouterModule, Field, SharedModule],
})
export class ChannelOverviewComponent {
  isLoading = signal(false);
  isSaving = signal(false);
  activeChannel = inject(ChannelService).channel;
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

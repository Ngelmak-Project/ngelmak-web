import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Field, form, max, maxLength, minLength, pattern, required } from '@angular/forms/signals';
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
  activeChannel = inject(ChannelService).channel;
  channelService = inject(ChannelService);
  alertService = inject(AlertService);
  isLoading = signal(false);
  isSaving = signal(false);

  protected channelModel = signal<IChannel>({
    name: '',
    description: '',
  });

  protected channelForm = form(this.channelModel, (p) => {
    required(p.name, { message: 'ngelmakTranslation.entities.channel.overview.name.required' });
    minLength(p.name, 3, {
      message: 'ngelmakTranslation.entities.channel.overview.name.minLength',
    });
    maxLength(p.name, 100, {
      message: 'ngelmakTranslation.entities.channel.overview.name.maxLength',
    });
    pattern(p.name, /^[a-zA-Z0-9_\- ]+$/, {
      message: 'ngelmakTranslation.entities.channel.overview.name.pattern',
    });
  });

  save(): void {
    this.isSaving.set(true);
    const channel = this.channelForm().value();
    channel.name = channel.name.trim();
    channel.description = channel.description.trim();
    this.channelService
      .create(channel)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (res) => {
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'ngelmakTranslation.entities.channel.overview.alerts.success',
            message: 'Chaine créée avec succès!',
          });
          this.channelService.updateLocalChannel(res.body);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'ngelmakTranslation.entities.channel.overview.alerts.error',
            message: 'Une erreur lors de la création.',
          }),
      });
  }
}

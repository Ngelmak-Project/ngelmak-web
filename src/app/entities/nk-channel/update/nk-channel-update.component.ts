import { HttpResponse } from '@angular/common/http';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ChannelService } from '../nk-channel.service';

@Component({
  standalone: true,
  selector: 'app-channel-update',
  templateUrl: './nk-channel-update.component.html',
  imports: [SharedModule, Field, SharedModule],
})
export class ChannelUpdateComponent implements OnInit {
  channel = input<IChannel>(null);
  onComplete = output<IChannel>();

  protected channelService = inject(ChannelService);
  protected alertService = inject(AlertService);
  isSaving = signal(false);

  channelModel = signal<IChannel>({
    name: '',
    description: '',
  });

  channelForm = form(this.channelModel, (p) => {
    required(p.name, { message: 'Le nom du compte est requis.' });
    maxLength(p.name, 100, { message: 'Le nombre maximum de caractères est 100.' });
    maxLength(p.description, 1000, { message: 'Le nombre maximum de caractères est 1000.' });
  });

  ngOnInit(): void {
    if (this.channel()) {
      this.channelModel.set(this.channel());
    }
  }

  save(): void {
    this.isSaving.set(true);
    const channel: IChannel = this.channelModel();
    channel.configuration = null;
    if (channel.id !== null) {
      this.subscribeToSaveResponse(this.channelService.update(channel));
    } else {
      this.subscribeToSaveResponse(this.channelService.create(channel));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IChannel>>): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        this.channelService.updateLocalChannel(res.body);
        this.onComplete.emit(res.body);
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: "Une erreur s'est produite.",
        }),
    });
  }
}

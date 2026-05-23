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
  protected channelService = inject(ChannelService);
  protected alertService = inject(AlertService);
  channel = input<IChannel>(null);
  onComplete = output<IChannel>();
  isSaving = signal(false);

  channelModel = signal<IChannel>({
    name: '',
    description: '',
  });

  channelForm = form(this.channelModel, (p) => {
    required(p.name, { message: 'ngelmakTranslation.entities.channel.update.name.required' });
    maxLength(p.name, 100, { message: 'ngelmakTranslation.entities.channel.update.name.maxLength' });
    maxLength(p.description, 1000, {
      message: 'ngelmakTranslation.entities.channel.update.description.maxLength',
    });
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
          translationKey: 'ngelmakTranslation.entities.channel.update.alerts.error',
          message: "Une erreur s'est produite.",
        }),
    });
  }
}

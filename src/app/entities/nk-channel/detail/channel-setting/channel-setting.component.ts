import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { AlertService } from "app/shared/alert/alert.service";
import SharedModule from "app/shared/shared.module";
import { finalize } from "rxjs";
import { ChannelService } from "../../nk-channel.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-channel-setting",
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./channel-setting.component.html",
})
export default class ChannelSettingComponent implements OnInit {
  private router = inject(Router);
  channelService = inject(ChannelService);
  alertService = inject(AlertService);
  channel = inject(ChannelService).channel;
  isSaving = signal(false);

  channelForm = new FormGroup({
    identifier: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
    }),
    name: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.maxLength(254)],
    }),
  });

  ngOnInit(): void {
    this.channelForm.patchValue(this.channel());
  }

  save(): void {
    this.isSaving.set(false);
    const channel = { ...this.channel(), ...this.channelForm.value };
    const identifierChanged =
      this.channel().identifier != this.channelForm.value["identifier"];
    this.channelService
      .update(channel)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (result) => {
          this.channelService.updateLocalChannel(result.body);
          this.alertService.addAlert({
            type: "success",
            message:
              "Les informations du compte ont été mises à jour avec succès.",
          });
          if (identifierChanged) {
            this.router.navigate(["nk-channel", this.channel().identifier]);
          }
        },
        error: () => {
          this.alertService.addAlert({
            type: "error",
            message: "Une erreur s'est produite lors de la mise à jour",
          });
        },
      });
  }
}

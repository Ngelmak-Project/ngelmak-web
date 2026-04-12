import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { ChannelUpdateComponent } from 'app/entities/nk-channel/update/nk-channel-update.component';
import { ChannelOverviewComponent } from 'app/entities/nk-channel/overview/nk-channel-overview.component';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-channel-page',
  templateUrl: './channel-page.component.html',
  imports: [CommonModule, RouterModule, ChannelUpdateComponent, ChannelOverviewComponent],
})
export class ChannelPageComponent {
  channel = inject(ChannelService).channel;

  protected alertService = inject(AlertService);
  protected channelService = inject(ChannelService);

  // VIEW SIGNALS
  isUploading = signal(false);
  isUpdating = signal(false);
  // 'avatar' | 'banner' | null
  editing = signal<'avatar' | 'banner' | null>(null);
  // Preview file before upload
  filePreview = signal<{ type: 'avatar' | 'banner'; data: File; url: string } | null>(null);

  /**
   * Handle file selection for avatar or banner.
   */
  handleImage(event: Event, type: 'avatar' | 'banner') {
    const input = event.target as HTMLInputElement;
    const data = input.files?.[0];

    if (!data) return;

    const preview = {
      type,
      data,
      url: URL.createObjectURL(data),
    };

    this.filePreview.set(preview);
    this.editing.set(type);
  }

  /**
   * Upload avatar or banner depending on the current editing type.
   */
  upload() {
    const preview = this.filePreview();
    if (!preview) return;

    this.isUploading.set(true);

    const request =
      preview.type === 'avatar'
        ? this.channelService.updateAvatar(preview.data)
        : this.channelService.updateBanner(preview.data);

    request
      .pipe(
        finalize(() => {
          this.isUploading.set(false);
          this.cancelEdit();
        }),
      )
      .subscribe({
        next: (res) => {
          this.channelService.updateLocalChannel(res.body);
          // Cleanup
          URL.revokeObjectURL(preview.url);
          this.filePreview.set(null);
          this.editing.set(null);
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            message: "Une erreur s'est produite lors de la mise à jour.",
          }),
      });
  }

  /**
   * Cancel editing and cleanup preview.
   */
  cancelEdit() {
    const preview = this.filePreview();
    if (preview) URL.revokeObjectURL(preview.url);

    this.filePreview.set(null);
    this.editing.set(null);
  }
}

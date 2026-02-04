import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInRight400ms } from 'app/shared/animations/fade-in-right.animation';
import { finalize } from 'rxjs';
import { AccountService } from '../nk-account.service';
import { AccountUpdateComponent } from '../update/nk-account-update.component';

@Component({
  standalone: true,
  selector: 'app-account-detail',
  templateUrl: './nk-account-detail.component.html',
  imports: [CommonModule, RouterModule, AccountUpdateComponent],
  animations: [fadeInRight400ms],
})
export class AccountDetailComponent {
  alertService = inject(AlertService);
  accountService = inject(AccountService);
  account = inject(AccountService).account;

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
        ? this.accountService.updateAvatar(preview.data)
        : this.accountService.updateBanner(preview.data);

    request
      .pipe(
        finalize(() => {
          this.isUploading.set(false);
          this.cancelEdit();
        }),
      )
      .subscribe({
        next: (res) => {
          this.accountService.updateLocalAccount(res.body);
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

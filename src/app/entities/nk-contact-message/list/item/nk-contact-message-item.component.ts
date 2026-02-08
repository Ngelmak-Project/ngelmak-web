import { Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { ContactMessageService } from 'app/entities/nk-contact-message/nk-contact-message.service';
import { ContactMessageUpdateComponent } from 'app/entities/nk-contact-message/update/nk-contact-message-update.component';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { DurationPipe } from 'app/shared/date';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { finalize } from 'rxjs';
import { IContactMessageDTO } from 'app/entities/models/nk-contact-message.model';

@Component({
  standalone: true,
  selector: 'app-contact-message-item',
  templateUrl: './nk-contact-message-item.component.html',
  imports: [
    CommonModule,
    RouterModule,
    DurationPipe,
    ContactMessageUpdateComponent,
    ClickOutsideDirective,
    ConfirmDialogComponent,
  ],
})
export class ContactMessageItemComponent implements OnInit {
  contactMessage = input<IContactMessageDTO>();
  contactMessageSig = signal<IContactMessageDTO | null>(null);
  level = input(0);
  replyTo = input<IContactMessageDTO>(null);
  onDeleted = output<IContactMessageDTO>();

  protected contactMessageService = inject(ContactMessageService);
  protected alertService = inject(AlertService);
  account = inject(AccountService).account;

  replies = signal<IContactMessageDTO[]>([]);
  isLoading = signal(false);
  isReplying = signal(false);
  isUpdating = signal(false);
  isDeleting = signal(false);
  showReplies = signal(false);
  openMenu = signal(false);
  confirmDeleteOpen = signal(false);

  ngOnInit() {
    this.contactMessageSig.set(this.contactMessage());
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  /**
   * Handles the result of a reply or an edit action.
   *
   * - If the returned contactMessage has a different ID than the current one,
   *   it represents a *new reply*, so we append it to the replies list
   *   and increment the reply counter.
   *
   * - If the IDs match, the user edited the current contactMessage,
   *   so we simply update the contactMessage in place.
   */
  handleReplyOrUpdate(newContactMessage: IContactMessageDTO) {
    const isNewReply = newContactMessage.id !== this.contactMessageSig().id;

    if (isNewReply) {
      // this.contactMessage.replyCount++;
      // this.contactMessageSig.update((c) => ({ ...c, replyCount: c.replyCount + 1 }));
      this.replies().push(newContactMessage);
    } else {
      this.isUpdating.set(false);
      this.contactMessageSig.update((c) => ({ ...c, ...newContactMessage }));
    }
  }

  handleDeleteConfirm(result: boolean) {
    this.confirmDeleteOpen.set(false);
    if (result) {
      this.isDeleting.set(true);
      this.contactMessageService
        .delete(this.contactMessageSig().id)
        .pipe(finalize(() => {
          this.isDeleting.set(false);
          this.openMenu.set(false);
        }))
        .subscribe({
          next: () => {
            this.onDeleted.emit(this.contactMessageSig());
          },
          error: () =>
            this.alertService.addAlert({
              type: 'error',
              message: "Une error s'est produit lors de la suppression.",
            }),
        });
    }
  }

  /**
   * Removes a deleted contactMessage from the local reply list and updates
   * the contactMessage's reply count accordingly.
   *
   * This method is typically called after the API confirms that a contactMessage
   * has been successfully deleted on the server.
   *
   * @param deleteContactMessage - The contactMessage object returned by the delete action,
   *                        containing at least the ID of the removed contactMessage.
   */
  onDeletedReply(deleteContactMessage: IContactMessageDTO) {
    // Decrement the total contactMessage count for the post
    // this.contactMessageSig.update((c) => ({ ...c, replyCount: c.replyCount - 1 }));
    // Update the reactive replies signal with the new list
    this.replies.update((list) => list.filter((c) => c.id !== deleteContactMessage.id));
  }
}

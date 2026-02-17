import { Component, inject, input, output, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { IChannelDTO } from 'app/entities/models/nk-channel.model';
import { ICommentDTO } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { TicketService } from '../nk-ticket.service';


const initTicket: ITicket = {
  id: null,
  description: '',
  evidence: null,
};

@Component({
  standalone: true,
  selector: 'app-ticket-dialog',
  templateUrl: './nk-ticket-dialog.component.html',
  animations: [fadeInUp400ms],
  imports: [CommonModule, Field],
})
export class TicketDialogComponent {
  post = input<IPostDTO>(); // Set went reporting a post.
  comment = input<ICommentDTO>(); // Set when reporting a comment that violate our policies.
  channel = input<IChannelDTO>(); // Set when report concerns a user's channel.
  onclose = output<void>(); // Emit even to close the dialog on the parent component.

  ticketService = inject(TicketService);
  alertService = inject(AlertService);

  isSaving = signal(false);
  ticketModel = signal<ITicket>(initTicket);

  ticketForm = form(this.ticketModel, (p) => {
    required(p.description, { message: 'Le contenu est requis.' });
    maxLength(p.description, 1000, { message: 'Nombre maximum de caractères est 1000.' });
  });

  save() {
    this.isSaving.set(true);
    const ticket: ITicket = {
      ...this.ticketModel(),
      evidence: null,
      post: this.post() ? { id: this.post().id } : null,
      comment: this.comment() ? { id: this.comment().id } : null,
      channel: this.channel() ? { id: this.channel().id } : null,
    };

    // Trim description to remove leading and trailing whitespace.
    ticket.description = ticket.description.trim();
    // Retrieve the image file.
    const media = this.ticketModel().evidence?.data || null;
    this.ticketService
      .create(ticket, media)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          // Emit the saved ticket back to the parent component with all necessary data.
          this.onclose.emit();
          // Reset the form and clear the file selection after successful save.
          this.removeFile(); // Clear file selection.
          this.ticketForm().reset(initTicket); // reset post values.
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'nkApp.ticket.updated',
            // “Merci, votre ticket a bien été soumis.”
            message: "Votre signalement a été transmis à l'équipe de modération.",
          });
        },
        error: () =>
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'nkApp.ticket.error',
            message: 'La création du ticket a échoué.',
          }),
      });
  }

  /**
   * Cancels the ticket creation or update process and emits a cancellation event to the parent component.
   */
  cancel() {
    this.removeFile(); // Clear file selection.
    this.ticketForm().reset(initTicket); // reset post values.
    this.onclose.emit();
  }

  handleFile(event) {
    const obj: File = event.target.files[0];
    if (obj) {
      if (obj.type.startsWith('image/')) {
        const file: IFile = { filename: obj.name, size: obj.size, type: obj.type, data: obj };
        file.url = URL.createObjectURL(obj);
        this.ticketModel.update((value) => ({ ...value, evidence: file }));
      } else {
        this.alertService.addAlert({
          type: 'warning',
          message: 'Seulement les images sont prises en charge.',
        });
      }
    }
  }

  /**
   * Remove joined file.
   */
  removeFile() {
    if (this.ticketModel().evidence) {
      URL.revokeObjectURL(this.ticketModel().evidence.url);
      this.ticketModel.update((value) => ({ ...value, evidence: null }));
    }
  }
}

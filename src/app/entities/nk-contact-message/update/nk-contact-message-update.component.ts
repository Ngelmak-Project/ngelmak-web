import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, Field, form, maxLength, required } from '@angular/forms/signals';
import { IContactMessage, IContactMessageDTO } from 'app/entities/models/nk-contact-message.model';
import { AlertService } from 'app/shared/alert/alert.service';
import { finalize } from 'rxjs';
import { ContactMessageService } from '../nk-contact-message.service';

const initContact: IContactMessageDTO = {
  email: null,
  subject: null,
  message: null,
};

@Component({
  selector: 'app-contact-message-update',
  standalone: true,
  imports: [CommonModule, Field],
  templateUrl: './nk-contact-message-update.component.html',
})
export class ContactMessageUpdateComponent {
  protected contactService = inject(ContactMessageService);
  protected alertService = inject(AlertService);

  contactModel = signal<IContactMessage | IContactMessageDTO>(initContact);

  contactForm = form(this.contactModel, (p) => {
    email(p.email, { message: "L'email est invalide." });
    required(p.subject, { message: 'Le sujet est requis.' });
    maxLength(p.subject, 255, { message: 'Nombre maximum de caractères est 255.' });
    required(p.message, { message: 'Le contenu de votre message est requis.' });
    maxLength(p.message, 1000, { message: 'Nombre maximum de caractères est 1000.' });
  });

  isSaving = signal(false);

  submit() {
    this.isSaving.set(true);
    const payload = this.contactModel();
    this.contactService
      .create(payload)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.contactForm().reset(initContact);
          this.alertService.addAlert({ type: 'success', message: 'Merci pour votre message.' });
        },
        error: () => {
          this.alertService.addAlert({ type: 'error', message: "Une error s'est produite." });
        },
      });
  }
}

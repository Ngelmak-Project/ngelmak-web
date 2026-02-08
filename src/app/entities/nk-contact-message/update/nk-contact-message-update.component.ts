import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { IContactMessage, IContactMessageDTO } from 'app/entities/models/nk-contact-message.model';
import { IPostDTO } from 'app/entities/models/nk-post.model';
import { AlertService } from 'app/shared/alert/alert.service';
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
  withAttach = input(true);
  contactMessage = input<IContactMessage | IContactMessageDTO>(null);
  replyTo = input<IContactMessage | IContactMessageDTO>(null);
  post = input<IPostDTO>(null);
  onSaveSuccess = output<IContactMessageDTO>();

  contactMessageService = inject(ContactMessageService);
  alertService = inject(AlertService);

  private contactService = inject(ContactMessageService);

  isSaving = signal(false);

  contactModel = signal<IContactMessage | IContactMessageDTO>(initContact);
  contactForm = form(this.contactModel, (p) => {});

  submit() {
    this.isSaving.set(true);

    const payload = this.contactModel();

    this.contactService.create(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.contactForm().reset(initContact);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }
}

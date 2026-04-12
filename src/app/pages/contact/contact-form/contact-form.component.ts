import { Component, inject, signal } from '@angular/core';
import { email, Field, form, maxLength, required } from '@angular/forms/signals';
import { AlertService } from 'app/shared/alert/alert.service';
import { UserService } from 'app/user-management/security/user.service';
import { finalize } from 'rxjs';

const initContactModel = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

@Component({
  standalone: true,
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  imports: [Field],
})
export class ContactFormComponent {
  userService = inject(UserService);
  contactModel = signal(initContactModel);
  alertService = inject(AlertService);

  contactForm = form(this.contactModel, (p) => {
    email(p.email, { message: 'Veuillez entrer une adresse e-mail valide.' });
    required(p.subject);
    maxLength(p.subject, 255, { message: 'Le sujet ne peut pas dépasser 255 caractères.' });
    required(p.message, { message: 'Le contenu du message est requis.' });
    maxLength(p.message, 1000, { message: 'Le message ne peut pas dépasser 1000 caractères.' });
  });

  isSubmitting = signal(false);

  submit(): void {
    this.isSubmitting.set(true);
    const { name, email, subject, message } = this.contactModel();
    this.userService
      .contactUs(name, email, subject, message)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.contactForm().reset(initContactModel);
          this.alertService.addAlert({
            type: 'success',
            translationKey: 'contact.form.success',
            message: 'Merci pour votre message, nous vous répondrons dans les plus brefs délais.',
          });
        },
        error: () => {
          this.alertService.addAlert({
            type: 'error',
            translationKey: 'contact.form.error',
            message:
              "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.",
          });
        },
      });
  }
}

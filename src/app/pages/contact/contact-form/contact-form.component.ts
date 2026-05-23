import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, Field, form, maxLength, required } from '@angular/forms/signals';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
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
  imports: [CommonModule, Field, SharedModule],
})
export class ContactFormComponent {
  userService = inject(UserService);
  contactModel = signal(initContactModel);
  alertService = inject(AlertService);

  contactForm = form(this.contactModel, (p) => {
    email(p.email, { message: 'ngelmakTranslation.pages.contact.form.email.invalid' });
    required(p.subject);
    maxLength(p.subject, 255, { message: 'ngelmakTranslation.pages.contact.form.subject.maxLength' });
    required(p.message, { message: 'ngelmakTranslation.pages.contact.form.message.required' });
    maxLength(p.message, 1000, { message: 'ngelmakTranslation.pages.contact.form.message.maxLength' });
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

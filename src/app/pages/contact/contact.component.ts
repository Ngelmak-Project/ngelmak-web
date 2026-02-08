import { Component } from '@angular/core';
import { ContactMessageUpdateComponent } from 'app/entities/nk-contact-message/update/nk-contact-message-update.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [ContactMessageUpdateComponent],
})
export class ContactComponent {}

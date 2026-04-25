import { Component } from '@angular/core';
import { ContactFormComponent } from './contact-form/contact-form.component';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [ContactFormComponent, SharedModule],
})
export class ContactComponent {}

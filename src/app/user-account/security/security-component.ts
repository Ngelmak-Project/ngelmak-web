import { Component } from '@angular/core';
import { SecurityProfileComponent } from './app-security-profile/app-security-profile.component';

@Component({
  selector: 'app-security-component',
  imports: [SecurityProfileComponent],
  templateUrl: './security-component.html',
})
export class SecurityComponent {}

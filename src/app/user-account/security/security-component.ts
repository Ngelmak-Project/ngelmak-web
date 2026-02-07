import { Component } from '@angular/core';
import { SecurityEmailComponent } from './app-security-email/app-security-email.component';
import { SecurityLoginComponent } from './app-security-login/app-security-login.component';
import { SecurityProfileComponent } from './app-security-profile/app-security-profile.component';
import { SecurityPasswordComponent } from './app-security-password/app-security-password.component';
import { SecurityDeleteComponent } from './app-security-delete/app-security-delete.component';

@Component({
  selector: 'app-security-component',
  imports: [SecurityProfileComponent, SecurityLoginComponent, SecurityEmailComponent, SecurityPasswordComponent, SecurityDeleteComponent],
  templateUrl: './security-component.html',
})
export class SecurityComponent {}

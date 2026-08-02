import { Pipe, PipeTransform } from '@angular/core';
import { Authentication } from 'app/core/auth/auth.model';

@Pipe({
  name: 'userInitials',
  standalone: true,
})
export class UserInitialsPipe implements PipeTransform {
  transform(user: Authentication): string {
    const first = user?.firstName?.trim().charAt(0) || '';
    const last = user?.lastName?.trim().charAt(0) || '';

    const initials = (first + last).toUpperCase();

    if (initials) return initials;

    // fallback to email
    const email = user?.email || '';
    const emailName = email.split('@')[0]; // part before @

    if (!emailName) return '';

    // Try to extract two initials from email username
    const parts = emailName.split(/[\.\_\-]/).filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // Otherwise just first character of email
    return emailName.charAt(0).toUpperCase();
  }
}

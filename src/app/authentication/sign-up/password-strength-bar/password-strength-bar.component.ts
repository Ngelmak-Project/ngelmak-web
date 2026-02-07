import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  imports: [CommonModule],
})
export class PasswordStrengthBarComponent {
  password = input<string>('');
  minLength = input<number>(8);
  strongLength = input<number>(12);

  strength = computed(() => {
    const p = this.password() ?? '';

    const hasMinLength = p.length >= this.minLength();
    const hasStrongLength = p.length >= this.strongLength();
    const hasUpperLowerLetters = /[A-Z]/.test(p) && /[a-z]/.test(p);
    const hasSymbol = /[#$&!@?*%]/.test(p);

    return {
      score:
        (hasMinLength ? 1 : 0) +
        (hasStrongLength ? 1 : 0) +
        (hasUpperLowerLetters ? 1 : 0) +
        (hasSymbol ? 1 : 0),
      hasStrongLength,
      hasUpperLowerLetters,
      hasSymbol,
    };
  });
}

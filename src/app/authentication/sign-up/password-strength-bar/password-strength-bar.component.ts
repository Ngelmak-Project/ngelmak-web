import { CommonModule } from '@angular/common';
import { Component, input, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  imports: [CommonModule],
})
export class PasswordStrengthBarComponent {
  password = input<string>('');
  minLength = input<number>(8);
  strongLength = input<number>(12);

  withSymbol = signal(false);
  withLongerPassword = signal(false);
  withUpperLowerCaseLetters = signal(false);

  constructor() {
    // Effect to update other signals
    effect(() => {
      const p = this.password() ?? '';

      this.withLongerPassword.set(p.length >= this.strongLength());
      this.withUpperLowerCaseLetters.set(/[A-Z]/.test(p) && /[a-z]/.test(p));
      this.withSymbol.set(/[#$&!@?*%]/.test(p));
    });
  }

  strength = computed(() => {
    const p = this.password() ?? '';
    let score = 0;

    if (p.length >= this.minLength()) score++;
    if (p.length >= this.strongLength()) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[#$&!@?*%]/.test(p)) score++;

    return Math.min(Math.max(score, 0), 4);
  });
}

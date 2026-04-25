import { TranslationService } from 'app/shared/translation/translation.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  showLangKeyOptions = signal(false);
  translateService = inject(TranslationService);

  changeLanguage(lang: 'en' | 'fr') {
    this.translateService.setLanguage(lang);
    this.showLangKeyOptions.set(false);
  }
}

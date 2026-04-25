import { TranslationService } from 'app/shared/translation/translation.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LANGUAGES } from 'app/config/language.constants';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  translateService = inject(TranslationService);

  showLangKeyOptions = signal(false);
  languages = LANGUAGES;
  lang = this.translateService.lang;

  changeLanguage(lang: string) {
    this.translateService.setLanguage(lang);
    this.showLangKeyOptions.set(false);
  }
}

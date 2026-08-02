import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { LANGUAGES } from 'app/config/language.constants';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { TranslationService } from 'app/shared/translation/translation.service';
import SharedModule from '../shared.module';

@Component({
  standalone: true,
  selector: 'app-preferences-panel',
  templateUrl: './preferences-panel.component.html',
  imports: [CommonModule, SharedModule],
  animations: [fadeInUp400ms],
})
export class PreferencesPanelComponent {
  translateService = inject(TranslationService);
  storageService = inject(StateStorageService);

  showPreferences = signal(false);
  languages = LANGUAGES;
  lang = this.translateService.lang;

  theme = signal<'light' | 'dark' | 'system'>('system');

  constructor() {
    this.initializeTheme();
  }

  async initializeTheme() {
    // 1. Try stored preference
    const stored = await this.storageService.getTheme();

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.theme.set(stored);
      this.applyTheme(stored);
      return;
    }

    // 2. Check DOM (Tailwind dark class already applied)
    if (document.documentElement.classList.contains('dark')) {
      this.theme.set('dark');
      return;
    }

    // 3. Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
    this.applyTheme(this.theme());
  }

  changeLanguage(lang: string) {
    this.translateService.setLanguage(lang);
  }

  async setTheme(value: 'light' | 'dark' | 'system') {
    this.theme.set(value);
    await this.storageService.storeTheme(value);
    this.applyTheme(value);
  }

  private applyTheme(value: 'light' | 'dark' | 'system') {
    if (value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      return;
    }

    document.documentElement.classList.toggle('dark', value === 'dark');
  }
}

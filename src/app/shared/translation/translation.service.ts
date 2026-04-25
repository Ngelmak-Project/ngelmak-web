import { inject, Injectable, OnInit, signal } from '@angular/core';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Injectable({ providedIn: 'root' })
export class TranslationService  {
  private stateStorageService = inject(StateStorageService);
  private primaryLang = signal<string>('fr');
  private fallbackLang: string = 'fr';
  private fallbackDictionary = signal<any>({});
  private fallbackLoaded = false;

  readonly lang = this.primaryLang;
  public dictionary = signal<any>({});

  constructor() {
    this.load(this.primaryLang());
  }

  async load(lang: string) {
    const data = await fetch(`assets/i18n/${lang}.json`).then((r) => r.json());
    this.dictionary.set(data);
    this.primaryLang.set(lang);
  }

  private async loadFallbackIfNeeded() {
    if (this.fallbackLoaded) return;
    const data = await fetch(`assets/i18n/${this.fallbackLang}.json`).then((r) => r.json());
    this.fallbackDictionary.set(data);
    this.fallbackLoaded = true;
  }

  setLanguage(lang: string) {
    this.load(lang);
    this.stateStorageService.storeLocale(lang);
  }

  private resolveKey(dict: any, key: string): any {
    return key.split('.').reduce((obj: any, part: string) => obj?.[part], dict);
  }

  async tAsync(key: string, params?: Record<string, any>): Promise<string> {
    let value = this.resolveKey(this.dictionary(), key);

    // If missing in primary → try fallback
    if (value === undefined) {
      await this.loadFallbackIfNeeded();
      value = this.resolveKey(this.fallbackDictionary(), key);

      if (value === undefined) {
        console.debug(`[i18n] Missing translation key: "${key}"`);
        return key;
      }
    }

    return this.interpolate(value, params);
  }

  translate(key: string, params?: Record<string, any>): string {
    let value = this.resolveKey(this.dictionary(), key);

    if (value === undefined) {
      // fallback not loaded yet → return key for now
      // directive will show default content
      console.debug(`[i18n] Missing translation key: "${key}"`);
      return key;
    }

    return this.interpolate(value, params);
  }

  private interpolate(value: string, params?: Record<string, any>): string {
    if (!params) return value;

    Object.keys(params).forEach((p) => {
      value = value.replace(new RegExp(`{{\\s*${p}\\s*}}`, 'g'), params[p]);
    });

    return value;
  }
}

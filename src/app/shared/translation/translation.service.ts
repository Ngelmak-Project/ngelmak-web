import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private stateStorageService = inject(StateStorageService);
  private authService = inject(AuthenticationService);

  //Current active language (reactive signal).
  private primaryLang = signal<string>('fr');
  readonly lang = this.primaryLang;

  /*
   * Cache of already-loaded languages.
   * Prevents refetching JSON files during the same session.
   */
  private cache = new Map<string, Record<string, string>>();
  // Flattened dictionary for the active language, e.g., { "home.title": "Welcome" }
  public dictionary = signal<Record<string, string>>({});

  constructor() {
    const lang = this.stateStorageService.getLocale();
    this.load(lang || this.primaryLang());
    effect(() => {
      const langKey = this.authService.authentication()?.langKey;
      this.load(langKey || this.primaryLang());
    });
  }

  /**
   * Loads a language file.
   * - Fetches JSON only if not already cached
   * - Flattens nested keys for fast lookup
   * - Updates reactive signals
   */
  async load(lang: string) {
    // Use cache if available
    if (this.cache.has(lang)) {
      this.dictionary.set(this.cache.get(lang)!);
      this.primaryLang.set(lang);
      return;
    }

    const json = await fetch(`assets/i18n/${lang}.json`).then((r) => r.json());
    const flat = this.flatten(json);

    this.cache.set(lang, flat);
    this.dictionary.set(flat);
    this.primaryLang.set(lang);
  }

  /**
   * Changes the active language and persists it.
   */
  async setLanguage(lang: string) {
    await this.load(lang);
    this.stateStorageService.storeLocale(lang);
    this.authService.updateUser({ langKey: lang });
  }

  /**
   * Flattens a nested JSON object into dot‑notation keys.
   * Example:
   *   { home: { title: "Hello" }} → { "home.title": "Hello" }
   */
  private flatten(obj: any, prefix = '', res: any = {}) {
    for (const key of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object') {
        this.flatten(obj[key], path, res);
      } else {
        res[path] = obj[key];
      }
    }
    return res;
  }

  /**
   * Returns the translated value for a given key.
   * If the key is missing, returns the key itself.
   */
  translate(key: string, params?: Record<string, any>): string {
    const value = this.dictionary()[key];

    if (value === undefined) {
      console.debug(`[i18n] Missing translation key: "${key}"`);
      return key;
    }

    return this.interpolate(value, params);
  }

  /**
   * Replaces {{ param }} placeholders inside translation strings.
   */
  private interpolate(value: string, params?: Record<string, any>): string {
    if (!params) return value;
    return Object.keys(params).reduce(
      (acc, p) => acc.replace(new RegExp(`{{\\s*${p}\\s*}}`, 'g'), params[p]),
      value,
    );
  }
}

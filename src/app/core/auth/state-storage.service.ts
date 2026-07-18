import { Injectable } from '@angular/core';
import { IChannel } from 'app/entities/models/nk-channel.model';

/**
 * Service for managing application state persistence across storage layers.
 *
 * Handles storage and retrieval of:
 * - Previous navigation URL (session-only)
 * - Authentication tokens (session or persistent)
 * - User locale preference (session-only)
 * - Theme preference (persistent)
 *
 * Uses sessionStorage for temporary data and localStorage for persistent user preferences.
 */
@Injectable({ providedIn: 'root' })
export class StateStorageService {
  /**
   * Storage key constants for application state persistence.
   */
  private readonly StorageKeys = {
    PREVIOUS_URL: 'previousUrl',
    AUTHENTICATION_TOKEN: 'authenticationToken',
    CHANNEL_CACHE_KEY: 'cachedUserChannel',
    LOCALE: 'locale',
    THEME: 'theme',
  } as const;

  // URL Management

  /**
   * Stores the previous URL in session storage.
   * @param url - The URL to store
   */
  storeUrl(url: string): void {
    sessionStorage.setItem(this.StorageKeys.PREVIOUS_URL, url);
  }

  /**
   * Retrieves the previously stored URL.
   * @returns The stored URL or null if not found
   */
  getUrl(): string | null {
    return sessionStorage.getItem(this.StorageKeys.PREVIOUS_URL);
  }

  /**
   * Clears the stored URL.
   */
  clearUrl(): void {
    sessionStorage.removeItem(this.StorageKeys.PREVIOUS_URL);
  }

  // Authentication Management

  /**
   * Stores authentication token in session or local storage based on rememberMe flag.
   * @param token - The authentication token to store
   * @param rememberMe - If true, persists token in localStorage; otherwise uses sessionStorage
   */
  storeAuthenticationToken(token: string, rememberMe: boolean): void {
    this.clearAuthenticationToken();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.StorageKeys.AUTHENTICATION_TOKEN, token);
  }

  /**
   * Retrieves the authentication token from storage.
   * Checks localStorage first (persistent), then sessionStorage.
   * @returns The stored authentication token or null if not found
   */
  getAuthenticationToken(): string | null {
    return (
      localStorage.getItem(this.StorageKeys.AUTHENTICATION_TOKEN) ??
      sessionStorage.getItem(this.StorageKeys.AUTHENTICATION_TOKEN)
    );
  }

  /**
   * Clears the authentication token from all storage layers.
   */
  private clearAuthenticationToken(): void {
    sessionStorage.removeItem(this.StorageKeys.AUTHENTICATION_TOKEN);
    localStorage.removeItem(this.StorageKeys.AUTHENTICATION_TOKEN);
    this.clearChannel();
  }

  // Locale Management

  /**
   * Stores the user's locale preference in session storage.
   * @param locale - The locale code (e.g., 'en-US', 'de-DE')
   */
  storeLocale(locale: string): void {
    sessionStorage.setItem(this.StorageKeys.LOCALE, locale);
  }

  /**
   * Retrieves the stored locale preference.
   * @returns The locale code or null if not found
   */
  getLocale(): string | null {
    return sessionStorage.getItem(this.StorageKeys.LOCALE);
  }

  /**
   * Clears the stored locale preference.
   */
  clearLocale(): void {
    sessionStorage.removeItem(this.StorageKeys.LOCALE);
  }

  // Theme Management

  /**
   * Stores the user's theme preference persistently in localStorage.
   * @param theme - The theme identifier (e.g., 'light', 'dark', 'auto')
   */
  storeTheme(theme: string): void {
    localStorage.setItem(this.StorageKeys.THEME, theme);
  }

  /**
   * Retrieves the stored theme preference.
   * @returns The theme identifier or null if not set
   */
  getTheme(): string | null {
    return localStorage.getItem(this.StorageKeys.THEME);
  }

  /**
   * Clears the stored theme preference, reverting to default behavior.
   */
  clearTheme(): void {
    localStorage.removeItem(this.StorageKeys.THEME);
  }

  /**
   * Stores the user's channel data in localStorage.
   * @param channel - The channel data to cache
   */
  storeChannel(channel: IChannel): void {
    try {
      const tokenInSession = sessionStorage.getItem(this.StorageKeys.AUTHENTICATION_TOKEN);

      if (tokenInSession) {
        // Token is session-based → channel must also be session-based
        sessionStorage.setItem(this.StorageKeys.CHANNEL_CACHE_KEY, JSON.stringify(channel));
        localStorage.removeItem(this.StorageKeys.CHANNEL_CACHE_KEY);
      } else {
        // Token is persistent → channel can be persistent
        localStorage.setItem(this.StorageKeys.CHANNEL_CACHE_KEY, JSON.stringify(channel));
        sessionStorage.removeItem(this.StorageKeys.CHANNEL_CACHE_KEY);
      }
    } catch (error) {
      console.warn('Failed to cache channel:', error);
    }
  }

  /**
   * Retrieves the cached channel data from localStorage.
   * @returns The cached channel or null if not found
   */
  getChannel(): IChannel | null {
    if (!this.validateTokenAndChannel()) {
      return null;
    }

    try {
      const cached =
        sessionStorage.getItem(this.StorageKeys.CHANNEL_CACHE_KEY) ??
        localStorage.getItem(this.StorageKeys.CHANNEL_CACHE_KEY);

      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to retrieve cached channel:', error);
      return null;
    }
  }

  validateTokenAndChannel(): boolean {
    const token =
      sessionStorage.getItem(this.StorageKeys.AUTHENTICATION_TOKEN) ??
      localStorage.getItem(this.StorageKeys.AUTHENTICATION_TOKEN);

    if (!token || token.trim() === '') {
      this.clearChannel();
      return false;
    }

    return true;
  }

  /**
   * Clears the cached channel from localStorage.
   */
  clearChannel(): void {
    try {
      sessionStorage.removeItem(this.StorageKeys.CHANNEL_CACHE_KEY);
      localStorage.removeItem(this.StorageKeys.CHANNEL_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear channel cache:', error);
    }
  }

  // Utility Methods

  /**
   * Clears all stored data from both session and local storage.
   * Useful for logout or reset scenarios.
   */
  clearAll(): void {
    sessionStorage.clear();
    localStorage.clear();
  }
}

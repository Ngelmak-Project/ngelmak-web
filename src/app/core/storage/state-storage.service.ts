import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { Authentication } from './../auth/auth.model';
import { NativeSecureStorageDriver } from './native-secured-storage.service';
import { IStorageDriver } from './storage.model';
import { WebStorageDriver } from './web-storage.service';

/**
 * Service for managing application state persistence across storage layers.
 *
 * Handles storage and retrieval of:
 * - Previous navigation URL
 * - Authentication tokens
 * - User lang preference
 * - Theme preference
 */
@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private driver: IStorageDriver;

  private readonly StorageKeys = {
    PREVIOUS_URL: 'previousUrl',
    AUTHENTICATION_TOKEN: 'authenticationToken',
    REFRESH_TOKEN: 'refreshToken',
    CONNECTED_USER_CACHE_KEY: 'cachedConnectedUser',
    CHANNEL_CACHE_KEY: 'cachedUserChannel',
    THEME: 'theme',
    LANG: 'lang',
  } as const;

  constructor() {
    this.driver = Capacitor.isNativePlatform()
      ? new NativeSecureStorageDriver()
      : new WebStorageDriver();
  }

  // ============= URL =============
  async storeUrl(url: string): Promise<void> {
    return this.driver.set(this.StorageKeys.PREVIOUS_URL, url);
  }

  async getUrl(): Promise<string | null> {
    return this.driver.get(this.StorageKeys.PREVIOUS_URL);
  }

  async clearUrl(): Promise<void> {
    return this.driver.remove(this.StorageKeys.PREVIOUS_URL);
  }

  // ============= AUTH =============
  async storeAuthenticationToken(token: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.driver.set(this.StorageKeys.AUTHENTICATION_TOKEN, token),
      this.driver.set(this.StorageKeys.REFRESH_TOKEN, refreshToken),
    ]);
  }

  async getAuthenticationToken(): Promise<string | null> {
    return this.driver.get(this.StorageKeys.AUTHENTICATION_TOKEN);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.driver.get(this.StorageKeys.REFRESH_TOKEN);
  }

  async clearAuthenticationToken(): Promise<void> {
    await Promise.all([
      this.driver.remove(this.StorageKeys.AUTHENTICATION_TOKEN),
      this.driver.remove(this.StorageKeys.REFRESH_TOKEN),
      this.clearChannel(),
      this.clearUser(),
    ]);
  }

  // ============= LANG =============
  async storeLang(lang: string): Promise<void> {
    return this.driver.set(this.StorageKeys.LANG, lang);
  }

  async getLang(): Promise<string | null> {
    return this.driver.get(this.StorageKeys.LANG);
  }

  async clearLang(): Promise<void> {
    return this.driver.remove(this.StorageKeys.LANG);
  }

  // ============= THEME =============
  async storeTheme(theme: string): Promise<void> {
    return this.driver.set(this.StorageKeys.THEME, theme);
  }

  async getTheme(): Promise<string | null> {
    return this.driver.get(this.StorageKeys.THEME);
  }

  async clearTheme(): Promise<void> {
    return this.driver.remove(this.StorageKeys.THEME);
  }

  // ============= CHANNEL =============
  async storeChannel(channel: IChannel): Promise<void> {
    return this.driver.set(this.StorageKeys.CHANNEL_CACHE_KEY, JSON.stringify(channel));
  }

  async getChannel(): Promise<IChannel | null> {
    const raw = await this.driver.get(this.StorageKeys.CHANNEL_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async clearChannel(): Promise<void> {
    return this.driver.remove(this.StorageKeys.CHANNEL_CACHE_KEY);
  }

  // ============= CONNECTED USER =============
  async storeUser(user: Authentication): Promise<void> {
    return this.driver.set(this.StorageKeys.CONNECTED_USER_CACHE_KEY, JSON.stringify(user));
  }

  async getUser(): Promise<Authentication | null> {
    const raw = await this.driver.get(this.StorageKeys.CONNECTED_USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async clearUser(): Promise<void> {
    return this.driver.remove(this.StorageKeys.CONNECTED_USER_CACHE_KEY);
  }
}

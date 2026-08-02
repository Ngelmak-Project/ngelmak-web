import { IStorageDriver } from './storage.model';

export class WebStorageDriver implements IStorageDriver {
  async get(key: string): Promise<string | null> {
    return sessionStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    sessionStorage.clear();
  }
}

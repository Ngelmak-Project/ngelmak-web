import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { IStorageDriver } from './storage.model';

export class NativeSecureStorageDriver implements IStorageDriver {
  async get(key: string): Promise<string | null> {
    try {
      const value = await SecureStorage.get(key);
      return value != null ? String(value) : null;
    } catch (error) {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStorage.set(key, value);
    } catch (error) {
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await SecureStorage.remove(key);
    } catch (error) {
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await SecureStorage.clear();
    } catch (error) {
      throw error;
    }
  }
}

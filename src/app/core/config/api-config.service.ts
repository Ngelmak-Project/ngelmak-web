import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  private readonly baseUrl = environment.apiUrl;

  /**
   * Builds a complete API URL for a given service and endpoint.
   * @param serviceName The name of the service (e.g., 'auth', 'core').
   * @param endpoint The specific endpoint for the service (e.g., 'me', 'channels').
   * @returns A complete URL string for the API call.
   */
  buildApiUrl(serviceName: string | null = null, endpoint: string | null = null): string {
    if (serviceName && endpoint) {
      return `${this.baseUrl}/${serviceName}/${endpoint}`;
    }

    if (serviceName) {
      return `${this.baseUrl}/${serviceName}`;
    }

    return this.baseUrl;
  }
}

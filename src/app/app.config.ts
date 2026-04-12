import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the HTTP client with interceptors for handling authentication and error responses.
    provideHttpClient(withInterceptors(httpInterceptorProviders)),
    // Global error listeners to catch unhandled errors and promise rejections.
    provideBrowserGlobalErrorListeners(),
    // This allows resolved data to be passed directly as component inputs.
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};

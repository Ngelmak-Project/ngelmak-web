import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors(httpInterceptorProviders)),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};

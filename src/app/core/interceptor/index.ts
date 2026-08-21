import { authInterceptor } from './auth.interceptor';
import { errorHandlerInterceptor } from './error-handler.interceptor';
// import { notificationInterceptor } from './notification.interceptor';

export const httpInterceptorProviders = [
  authInterceptor,
  errorHandlerInterceptor,
  // notificationInterceptor,
];

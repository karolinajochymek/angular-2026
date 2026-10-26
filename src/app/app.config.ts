import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { trainingInterceptor } from './core/interceptors/training.interceptor';
export const appConfig: ApplicationConfig = {
  // Angular 22 domyślnie używa fetch; withFetch() jest już zbędne i deprecated.
  // withXhr() wybiera XHR, np. gdy potrzebny jest postęp wysyłania pliku.
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([trainingInterceptor]))],
};

import { HttpInterceptorFn } from '@angular/common/http';
// Celowo bez prawdziwego tokenu. Nagłówek trafia tylko do lokalnego zasobu demo.
export const trainingInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/assets/')) return next(request);
  // Żądanie jest niemutowalne: clone tworzy kopię. next przekazuje ją dalej w łańcuchu HTTP.
  return next(request.clone({ setHeaders: { 'X-Training-Demo': 'angular-2026' } }));
};

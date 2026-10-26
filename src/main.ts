import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
// CurrencyPipe i DatePipe z argumentem 'pl' potrzebują zarejestrowanych danych locale.
// Sam argument pipe'a nie pobiera tych danych. Rejestrujemy je raz, przed uruchomieniem aplikacji.
registerLocaleData(localePl);
bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));

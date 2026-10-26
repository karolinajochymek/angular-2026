import { Component } from '@angular/core';
import { MainPageComponent } from './features/main-page/main-page.component';
// Od Angulara 19 komponenty są domyślnie standalone; imports określa zależności szablonu.
// Komponent deklarowany w NgModule oznaczamy standalone: false.
@Component({
  selector: 'app-root',
  imports: [MainPageComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}

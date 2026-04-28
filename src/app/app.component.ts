import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MainPageComponent } from './features/main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Komponent standalone — importuje zależności bezpośrednio, bez AppModule
  imports: [MainPageComponent],
})
export class AppComponent {}

import { Component } from '@angular/core';
import { SignalCounterComponent } from '../signal-counter/signal-counter.component';
import { PermissionDemoComponent } from '../permission-demo/permission-demo.component';
// strona składa przykłady z osobnych komponentów.
// Każde dziecko przechowuje własny stan; imports udostępnia je w szablonie standalone.
@Component({
  selector: 'app-main-page',
  imports: [SignalCounterComponent, PermissionDemoComponent],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ItemsListComponent } from '../items/items-list/items-list.component';
import { SignalCounterComponent } from '../signal-counter/signal-counter.component';
import { PermissionDemoComponent } from '../permission-demo/permission-demo.component';
// strona składa przykłady z osobnych komponentów.
// Każde dziecko przechowuje własny stan; imports udostępnia je w szablonie standalone.
@Component({
  selector: 'app-main-page',
  imports: [ItemsListComponent, SignalCounterComponent, PermissionDemoComponent],
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ItemsListComponent } from '../items/items-list/items-list.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemsListComponent],
})
export class MainPageComponent {
  // signal() zamiast zwykłego stringa — zmiana wartości automatycznie aktualizuje widok
  readonly title = signal('Witamy na szkoleniu');

  changeTitle(): void {
    // .update() — aktualizuje wartość sygnału na podstawie poprzedniej wartości
    this.title.update(t => t + '!');
  }
}

import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Temat: komunikacja komponentów i model(). Material dostarcza wygląd i obsługę klawiatury.
@Component({
  selector: 'app-stock-toggle',
  imports: [MatSlideToggleModule],
  template: `<mat-slide-toggle [checked]="checked()" (change)="checked.set($event.checked)">
    Tylko dostępne
  </mat-slide-toggle>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockToggleComponent {
  // model tworzy sygnał wejściowy i zdarzenie checkedChange.
  // Rodzic używa [(checked)]="onlyAvailable", aby zsynchronizować swój stan z dzieckiem.
  readonly checked = model(false);
}

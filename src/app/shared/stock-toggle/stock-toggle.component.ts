import { Component, model } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Temat: komunikacja komponentów i model(). Material dostarcza wygląd i obsługę klawiatury.
@Component({
  selector: 'app-stock-toggle',
  imports: [MatSlideToggleModule],
  templateUrl: './stock-toggle.component.html',
})
export class StockToggleComponent {
  // model tworzy sygnał wejściowy i zdarzenie checkedChange.
  // Rodzic używa [(checked)]="onlyAvailable", aby zsynchronizować swój stan z dzieckiem.
  readonly checked = model(false);
}

import { MatCardModule } from '@angular/material/card';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../models/item';
@Component({
  selector: 'app-inventory-summary',
  imports: [MatCardModule, CurrencyPipe],
  template:
    '<mat-card appearance="outlined"><div class="summary"><h3>Podsumowanie magazynu</h3><p>Wartość zapasu: {{ total() | currency:"PLN":"symbol":"1.2-2":"pl" }}</p></div></mat-card>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySummaryComponent {
  readonly items = input.required<readonly Item[]>();
  // Temat: computed i @defer. reduce sumuje cenę × liczbę sztuk wszystkich produktów.
  // Rodzic opóźnia załadowanie tego komponentu; obliczenie nie wykonuje żądania HTTP.
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
}

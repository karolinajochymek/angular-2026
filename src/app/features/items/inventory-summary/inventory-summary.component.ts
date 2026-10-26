import { MatCardModule } from '@angular/material/card';
import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../models/item';
@Component({
  selector: 'app-inventory-summary',
  imports: [MatCardModule, CurrencyPipe],
  templateUrl: './inventory-summary.component.html',
})
export class InventorySummaryComponent {
  readonly items = input.required<readonly Item[]>();
  // Temat: computed i @defer. reduce sumuje cenę × liczbę sztuk wszystkich produktów.
  // Rodzic opóźnia załadowanie tego komponentu; obliczenie nie wykonuje żądania HTTP.
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
}

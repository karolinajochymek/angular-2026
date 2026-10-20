import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from '../item/item.component';
import { ITEMS } from '../data/items';
import { StockToggleComponent } from '../../../shared/stock-toggle/stock-toggle.component';
import { InventorySummaryComponent } from '../inventory-summary/inventory-summary.component';
@Component({
  selector: 'app-items-list',
  imports: [
    HighlightDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ItemComponent,
    StockToggleComponent,
    InventorySummaryComponent,
  ],
  templateUrl: './items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsListComponent {
  // lista zarządza danymi i filtrami, ItemComponent renderuje pojedynczy produkt.
  readonly items = signal(ITEMS);
  // Temat: signals. signal przechowuje zmienny stan; filter() odczytuje, filter.set(...) zapisuje.
  readonly filter = signal('');
  // Ten sygnał łączy się z model() dziecka przez [(checked)] w szablonie.
  readonly onlyAvailable = signal(false);
  readonly selectedId = signal<number | null>(null);
  // computed wylicza widok z aktualnych danych i filtrów. Angular śledzi odczytane sygnały.
  // Nie potrzebujemy effect, który ręcznie kopiowałby wynik do kolejnego signal.
  // Opcjonalnie Copilot: poproś o przypadki brzegowe filtra (spacje, wielkość liter, brak zapasu).
  // Najpierw przewidź wynik samodzielnie; porównaj propozycję z testami, bez zmiany API.
  readonly filteredItems = computed(() => {
    const query = this.filter().trim().toLocaleLowerCase('pl');
    return this.items().filter(
      (item) =>
        item.name.toLocaleLowerCase('pl').includes(query) &&
        (!this.onlyAvailable() || item.quantity > 0),
    );
  });
  readonly selectedItem = computed(() =>
    this.items().find((item) => item.id === this.selectedId()),
  );
  // update korzysta z poprzedniego stanu; map i spread tworzą nową tablicę oraz obiekty.
  // Dzięki temu zachowujemy niemutowalność: nie wykonujemy items()[0].quantity++.
  restock(): void {
    this.items.update((items) => items.map((item) => ({ ...item, quantity: item.quantity + 1 })));
  }
}

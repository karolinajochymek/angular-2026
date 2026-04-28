import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Item } from '../models/item';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ItemComponent],
})
export class ItemsListComponent {
  // signal() — reaktywny pojemnik na dane; aktualizacja przez .set() lub .update()
  readonly items = signal<Item[]>([
    { no: 1, name: 'One', quantity: 2, price: 25.34, isClicked: false },
    { no: 2, name: 'Two', quantity: 4, price: 26.00, isClicked: false },
    { no: 3, name: 'Three', quantity: 6, price: 5.12, isClicked: false },
    {},
  ]);

  // filter jako sygnał — zmiany są automatycznie śledzone przez computed()
  readonly filter = signal('');

  // computed() — pochodna (derived) wartość; przelicza się gdy items() lub filter() zmieni wartość
  // będzie rozszerzony w części 2 szkolenia przy temacie serwisów i RxJS
  readonly filteredItems = computed(() => this.items());

  onClickedItem(no: number): void {
    // .update() — niemutowalna aktualizacja: tworzy nową tablicę zamiast modyfikować oryginalną
    this.items.update(items =>
      items.map(item => ({ ...item, isClicked: item.no === no }))
    );
  }
}

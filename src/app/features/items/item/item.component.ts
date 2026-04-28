import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Item } from '../models/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
})
export class ItemComponent {
  // input() zwraca Signal<Item> — wartość odczytujemy wywołując: item()
  // zastępuje @Input() item: Item = {}
  readonly item = input<Item>({});

  // output() zastępuje @Output() + EventEmitter; API .emit() jest identyczne
  readonly clickedItem = output<number>();

  onClick(): void {
    if (this.item()?.no) {
      this.clickedItem.emit(this.item().no!);
    }
  }
}

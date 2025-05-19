import { Component } from '@angular/core';
import { Item } from '../models/item';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss'
})
export class ItemsListComponent {
  items: Item[] = [{
    no: 1,
    name: 'One',
    quantity: 2,
    price: 25.34,
    isClicked: false
  }, {
    no: 2,
    name: 'Two',
    quantity: 4,
    price: 26.00,
    isClicked: false
  }, {
    no: 3,
    name: 'Three',
    quantity: 6,
    price: 5.12,
    isClicked: false
  },
    {}
  ];

  filter = '';

  get filteredItems(): Item[] {
    return this.items; // będzie dostepne na 2 części szkolenia przy temacie rxJs
  }

  onClickedItem(no: number) {
    this.items.forEach(item => {
      if (item.no !== no) {
        item.isClicked = false;
      } else {
        item.isClicked = true;
      }
    })
  }
}

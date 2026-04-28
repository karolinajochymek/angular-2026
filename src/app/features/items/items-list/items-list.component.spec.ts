import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsListComponent } from './items-list.component';

describe('ItemsListComponent', () => {
  let fixture: ComponentFixture<ItemsListComponent>;
  let component: ItemsListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose filteredItems as a computed signal returning all items by default', () => {
    expect(component.filteredItems()).toHaveLength(4);
  });

  it('should mark only the clicked item as isClicked on onClickedItem()', () => {
    component.onClickedItem(2);
    const clicked = component.items().filter(i => i.isClicked);
    expect(clicked).toHaveLength(1);
    expect(clicked[0].no).toBe(2);
  });
});

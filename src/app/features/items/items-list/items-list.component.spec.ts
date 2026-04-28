import { TestBed } from '@angular/core/testing';

import { ItemsListComponent } from './items-list.component';

describe('ItemsListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsListComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose filteredItems as a computed signal returning all items by default', () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    expect(fixture.componentInstance.filteredItems()).toHaveLength(4);
  });

  it('should mark only the clicked item as isClicked on onClickedItem()', () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    const component = fixture.componentInstance;
    component.onClickedItem(2);
    const clicked = component.items().filter(i => i.isClicked);
    expect(clicked).toHaveLength(1);
    expect(clicked[0].no).toBe(2);
  });
});

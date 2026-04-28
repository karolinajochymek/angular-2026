import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  let fixture: ComponentFixture<ItemComponent>;
  let component: ItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clickedItem with item.no when onClick() is called with a valid item', () => {
    fixture.componentRef.setInput('item', { no: 1, name: 'Test' });
    let emitted: number | undefined;
    component.clickedItem.subscribe((no: number) => (emitted = no));
    component.onClick();
    expect(emitted).toBe(1);
  });

  it('should not emit when onClick() is called with an item without no', () => {
    fixture.componentRef.setInput('item', {});
    let emitted: number | undefined;
    component.clickedItem.subscribe((no: number) => (emitted = no));
    component.onClick();
    expect(emitted).toBeUndefined();
  });
});

import { TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ItemComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit clickedItem with item.no when onClick() is called with a valid item', () => {
    const fixture = TestBed.createComponent(ItemComponent);
    fixture.componentRef.setInput('item', { no: 1, name: 'Test' });
    let emitted: number | undefined;
    fixture.componentInstance.clickedItem.subscribe((no: number) => (emitted = no));
    fixture.componentInstance.onClick();
    expect(emitted).toBe(1);
  });

  it('should not emit when onClick() is called with an item without no', () => {
    const fixture = TestBed.createComponent(ItemComponent);
    fixture.componentRef.setInput('item', {});
    let emitted: number | undefined;
    fixture.componentInstance.clickedItem.subscribe((no: number) => (emitted = no));
    fixture.componentInstance.onClick();
    expect(emitted).toBeUndefined();
  });
});

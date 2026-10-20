import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ItemsListComponent } from './items-list.component';
registerLocaleData(localePl);
describe('Lista produktów', () => {
  it('przedstawia dane produktu w osobnych kolumnach z nagłówkami', async () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    await fixture.whenStable();
    const table: HTMLTableElement = fixture.nativeElement.querySelector('table');
    expect(Array.from(table.querySelectorAll('th'), (cell) => cell.textContent?.trim())).toEqual([
      'Nazwa',
      'Typ',
      'Ilość',
      'Cena',
      'Wybierz',
    ]);
    const cells = table.querySelectorAll('tbody tr:first-child td');
    expect(cells).toHaveLength(5);
    expect(cells[0].textContent?.trim()).toBe('Notes');
    expect(cells[1].textContent?.trim()).toBe('Artykuły biurowe');
    expect(cells[2].textContent?.trim()).toBe('8');
    expect(cells[3].textContent?.replace(/\s/g, '')).toBe('18,90zł');
    expect(cells[4].querySelector('button')).not.toBeNull();
  });
  it('filtruje reaktywnie po nazwie i dostępności', async () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    fixture.componentInstance.filter.set(' MYSZ ');
    await fixture.whenStable();
    expect(fixture.componentInstance.filteredItems().map((item) => item.id)).toEqual([4]);
    fixture.componentInstance.onlyAvailable.set(true);
    await fixture.whenStable();
    expect(fixture.componentInstance.filteredItems()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Brak produktów');
  });
  it('aktualizuje zapas bez mutowania poprzednich danych', () => {
    const component = TestBed.createComponent(ItemsListComponent).componentInstance;
    const before = component.items();
    component.restock();
    expect(component.items()[0].quantity).toBe(before[0].quantity + 1);
    expect(before[0].quantity).toBe(8);
    expect(component.items()[0]).not.toBe(before[0]);
  });
  it('przekazuje zdarzenie dziecka do stanu rodzica', async () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('tr[app-item] button').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selectedId()).toBe(1);
    expect(
      fixture.nativeElement.querySelector('tr[app-item] button').getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('aktualizuje dane dziecka po dostawie i zachowuje jego wiersz dzięki track id', async () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    await fixture.whenStable();
    const row: HTMLTableRowElement = fixture.nativeElement.querySelector('tr[app-item]');
    row.querySelector('button')!.click();
    fixture.componentInstance.restock();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('tr[app-item]')).toBe(row);
    expect(row.cells[2].textContent?.trim()).toBe('9');
    expect(row.querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ItemsListComponent } from './items-list.component';
import { ITEMS } from '../data/items';
registerLocaleData(localePl);

describe('Lista z HTTP', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('po błędzie pobiera dane przy kolejnej zmianie trybu i filtruje wyniki', async () => {
    const fixture = TestBed.createComponent(ItemsListComponent);
    const http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    expect(fixture.componentInstance.state().status).toBe('loading');
    http.expectOne('/assets/items.json').flush([], { status: 500, statusText: 'Demo error' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Nie udało',
    );
    fixture.componentInstance.mode.set('empty');
    await fixture.whenStable();
    http.expectOne('/assets/empty.json').flush([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Magazyn jest pusty');
    fixture.componentInstance.mode.set('normal');
    await fixture.whenStable();
    http.expectOne('/assets/items.json').flush(ITEMS);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('tr[app-item]').length).toBe(6);
    const row: HTMLTableRowElement = fixture.nativeElement.querySelector('tr[app-item]');
    expect(row.cells).toHaveLength(5);
    expect(row.cells[0].querySelector('a')?.getAttribute('href')).toBe('/items/1');
    expect(row.cells[2].textContent?.trim()).toBe('8');
    row.querySelector('button')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selectedId()).toBe(1);
    expect(row.querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
    fixture.componentInstance.filter.set(' MYSZ ');
    fixture.componentInstance.onlyAvailable.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Brak dopasowań');
  });
});

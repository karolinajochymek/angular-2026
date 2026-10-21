import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { ItemEditComponent } from './item-edit.component';
import { CatalogService } from '../../../core/services/catalog.service';
import { trainingInterceptor } from '../../../core/interceptors/training.interceptor';
import { ITEMS } from '../data/items';

registerLocaleData(localePl);
describe('Edycja produktu', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({ id: '1' }));
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([trainingInterceptor])),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: params, snapshot: {} } },
      ],
    });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.restoreAllMocks();
  });
  async function load() {
    const fixture = TestBed.createComponent(ItemEditComponent);
    const request = TestBed.inject(HttpTestingController).expectOne('/assets/items.json');
    expect(request.request.headers.get('X-Training-Demo')).toBe('angular-2026');
    request.flush(ITEMS);
    await fixture.whenStable();
    return fixture;
  }
  it('waliduje pola, nie zapisuje błędnych danych i akceptuje zerowy zapas oraz cenę', async () => {
    const fixture = await load();
    const component = fixture.componentInstance;
    const save = vi.spyOn(TestBed.inject(CatalogService), 'saveItem');
    component.form.setValue({ name: '  ', price: -1, quantity: 1.5 });
    component.save();
    await fixture.whenStable();
    expect(save).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('mat-error')).toHaveLength(3);
    component.form.setValue({ name: 'Notes', price: 0, quantity: 0 });
    expect(component.form.valid).toBe(true);
  });
  it('zapisuje zmiany w serwisie i czyści dirty przed nawigacją do szczegółów', async () => {
    const fixture = await load();
    const component = fixture.componentInstance;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[formControlName="name"]');
    input.value = 'Nowy notes';
    input.dispatchEvent(new Event('input'));
    expect(component.hasUnsavedChanges()).toBe(true);
    component.save();
    expect(component.hasUnsavedChanges()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/items', 1]);
    let savedName = '';
    TestBed.inject(CatalogService)
      .getItem(1)
      .subscribe((item) => (savedName = item!.name));
    TestBed.inject(HttpTestingController).expectOne('/assets/items.json').flush(ITEMS);
    expect(savedName).toBe('Nowy notes');
    expect(ITEMS[0].name).toBe('Notes');
  });
  it('po błędzie zapisu zachowuje dane i niezapisane zmiany', async () => {
    const fixture = await load();
    const component = fixture.componentInstance;
    vi.spyOn(TestBed.inject(CatalogService), 'saveItem').mockReturnValue(
      throwError(() => new Error('demo')),
    );
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    component.form.controls.name.setValue('Nowy notes');
    component.form.markAsDirty();
    component.save();
    await fixture.whenStable();
    expect(component.hasUnsavedChanges()).toBe(true);
    expect(component.saving()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Nie udało się zapisać',
    );
  });
  it('obsługuje brak produktu oraz błąd HTTP i odzyskuje formularz po zmianie id', async () => {
    const fixture = TestBed.createComponent(ItemEditComponent);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/assets/items.json').flush([], { status: 500, statusText: 'Demo error' });
    await fixture.whenStable();
    expect(fixture.componentInstance.status()).toBe('error');
    params.next(convertToParamMap({ id: '999' }));
    expect(fixture.componentInstance.status()).toBe('loading');
    http.expectOne('/assets/items.json').flush(ITEMS);
    await fixture.whenStable();
    expect(fixture.componentInstance.status()).toBe('missing');
    params.next(convertToParamMap({ id: '2' }));
    http.expectOne('/assets/items.json').flush(ITEMS);
    await fixture.whenStable();
    expect(fixture.componentInstance.status()).toBe('ready');
    expect(fixture.componentInstance.form.controls.name.value).toBe('Długopis');
  });
});

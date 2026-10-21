import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Item } from '../../features/items/models/item';
export type DemoMode = 'normal' | 'empty' | 'error';
// providedIn: root udostępnia wspólną instancję w injectorze aplikacji.
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  // Zmiany zapisane w pamięci zastępują wartości odczytane z JSON, bez zapisu na serwerze.
  private readonly edits = signal<Record<number, Item>>({});
  // HttpClient zwraca Observable: samo wywołanie metody nie wysyła jeszcze żądania.
  // Subskrypcja (np. przez toSignal) uruchamia pobieranie; map przekształca otrzymane dane.
  getItems(mode: DemoMode = 'normal'): Observable<readonly Item[]> {
    const url =
      mode === 'error'
        ? '/assets/missing-demo.json'
        : mode === 'empty'
          ? '/assets/empty.json'
          : '/assets/items.json';
    return this.http
      .get<readonly Item[]>(url)
      .pipe(map((items) => items.map((item) => this.edits()[item.id] ?? item)));
  }
  getItem(id: number): Observable<Item | undefined> {
    return this.getItems().pipe(map((items) => items.find((item) => item.id === id)));
  }
  saveItem(item: Item): Observable<Item> {
    // Zapis w pamięci znika po odświeżeniu strony. Trwały zapis wymaga obsługi po stronie serwera.
    this.edits.update((edits) => ({ ...edits, [item.id]: { ...item } }));
    return of(item);
  }
}

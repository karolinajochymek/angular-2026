import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Item } from '../../features/items/models/item';
export type DemoMode = 'normal' | 'empty' | 'error';
// Angular 22 CLI generuje @Service(): serwis jest automatycznie dostępny przez DI.
// Lista, szczegóły i edycja korzystają ze wspólnej instancji.
// Nadal poprawny zapis: @Injectable({ providedIn: 'root' }).
// providers: [CatalogService] w komponencie tworzyłoby lokalny zakres i osobną pamięć edycji.
@Service()
export class CatalogService {
  private readonly http = inject(HttpClient);
  // Zmiany zapisane w pamięci zastępują wartości odczytane z JSON, bez zapisu na serwerze.
// W stanie opartym na RxJS można spotkać BehaviorSubject i next(...).
  // To nadal użyteczne API strumieniowe; signal daje tutaj synchroniczny odczyt edits().
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

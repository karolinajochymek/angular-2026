import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CatalogService, DemoMode } from '../../../core/services/catalog.service';
import { Item } from '../models/item';
import { ItemComponent } from '../item/item.component';
import { StockToggleComponent } from '../../../shared/stock-toggle/stock-toggle.component';
import { InventorySummaryComponent } from '../inventory-summary/inventory-summary.component';
// Unia rozróżniana przez status: data istnieje tylko dla success, message tylko dla error.
// @switch w HTML zawęża typ do odpowiedniego wariantu.
type ListState =
  | { status: 'loading' }
  | { status: 'success'; data: readonly Item[] }
  | { status: 'error'; message: string };
@Component({
  selector: 'app-items-list',
  imports: [
    HighlightDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    FormsModule,
    ItemComponent,
    StockToggleComponent,
    InventorySummaryComponent,
  ],
  templateUrl: './items-list.component.html',
  // Angular 22 domyślnie używa OnPush. Tu zapis jest jawny, aby rozpoznać go także w starszym kodzie.
  // W pozostałych komponentach korzystamy z wartości domyślnej.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsListComponent {
  // Opcje są danymi: etykietę lub kolejność zmieniamy tutaj, bez kopiowania HTML.
  // DemoMode sprawdza, czy value odpowiada scenariuszowi obsługiwanemu przez serwis.
  // Stała konfiguracja nie potrzebuje signal; sygnałem jest dopiero wybrany mode.
  readonly demoModes: readonly { value: DemoMode; label: string }[] = [
    { value: 'normal', label: 'Normalny' },
    { value: 'empty', label: 'Pusta odpowiedź' },
    { value: 'error', label: 'Błąd HTTP' },
  ];
  // Lista zarządza danymi i filtrami, ItemComponent renderuje pojedynczy produkt.
  // inject pobiera serwis z injectora zamiast tworzyć go przez new.
  private readonly catalog = inject(CatalogService);
  readonly mode = signal<DemoMode>('normal');
  // signal przechowuje zmienny stan; filter() odczytuje, filter.set(...) zapisuje.
  readonly filter = signal('');
  // Ten sygnał łączy się z model() dziecka przez [(checked)] w szablonie.
  readonly onlyAvailable = signal(false);
  readonly selectedId = signal<number | null>(null);
  // toObservable zamienia zmiany trybu w strumień. switchMap przełącza na najnowsze żądanie.
  // catchError wewnątrz switchMap obsługuje błąd pojedynczego HTTP, zachowując kolejne zmiany trybu.
  // startWith zapewnia loading dla każdego żądania. toSignal udostępnia stan synchronicznie w HTML
  // i automatycznie sprząta subskrypcję wraz ze zniszczeniem komponentu.
  // map opakowuje dane w success; of emituje zastępczy stan error i kończy ten strumień.
  // Nie tworzymy toSignal ani nowych żądań przy każdym odczycie szablonu.
  readonly state = toSignal(
    toObservable(this.mode).pipe(
      switchMap((mode) =>
        this.catalog.getItems(mode).pipe(
          map((data): ListState => ({ status: 'success', data })),
          startWith<ListState>({ status: 'loading' }),
          catchError(() =>
            of<ListState>({
              status: 'error',
              message: 'Nie udało się pobrać produktów. Wybierz ponownie tryb normalny.',
            }),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as ListState },
  );
  readonly items = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data : [];
  });
  // computed wylicza widok z aktualnych danych i filtrów. Angular śledzi odczytane sygnały.
  // Nie potrzebujemy effect, który ręcznie kopiowałby wynik do kolejnego signal.
  // Opcjonalnie Copilot: poproś o przypadki brzegowe filtra (spacje, wielkość liter, brak zapasu).
  // Najpierw przewidź wynik samodzielnie; porównaj propozycję z testami, bez zmiany API.
  readonly filteredItems = computed(() =>
    this.items().filter(
      (item) =>
        item.name.toLocaleLowerCase('pl').includes(this.filter().trim().toLocaleLowerCase('pl')) &&
        (!this.onlyAvailable() || item.quantity > 0),
    ),
  );
}

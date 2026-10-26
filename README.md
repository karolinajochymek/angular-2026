# Angular od podstaw — część 2

Rozwinięcie listy produktów o DI, HTTP/RxJS, routing i Reactive Forms. Angular i Angular Material 22.2.3.

Przygotowanie od zera: [instrukcja środowiska](PRZYGOTOWANIE-SRODOWISKA.md). Pomysły na dobrowolną pomoc AI: [Copilot](COPILOT-OPCJONALNIE.md).

```sh
npm ci
npm start -- --port 4201
```

`npm run check` uruchamia lint, testy Vitest i build. Na Windows PowerShell można używać `npm.cmd`.

## Mapa demonstracji

| Temat | Kod / trasa | Co sprawdzić |
|---|---|---|
| Serwis i DI | `src/app/core/services/catalog.service.ts` | Wspólne źródło danych listy i szczegółów |
| HTTP, RxJS i `toSignal` | `/items` | Tryby normalny, pusty, błąd, ponownie normalny |
| Routing i lazy loading | `src/app/app.routes.ts` | Lista, szczegóły, edycja, nieznany adres |
| Reactive Forms | `/items/1/edit` | Pusta nazwa, ujemna cena, ułamkowa liczba sztuk |
| Guards | `src/app/core/guards` | Niepoprawne id i opuszczenie zmienionego formularza |
| Interceptor | `src/app/core/interceptors` | Nagłówek `X-Training-Demo` w Network |
| Podstawy | `/basics` | Licznik signals i dyrektywa widoczności |
| Lifecycle | `/lifecycle` | Zmiana input, usunięcie i odtworzenie dziecka, konsola |
| Bezpieczeństwo | `/security` | Interpolacja i sanityzowany HTML |
| Starsze projekty | `/legacy` | NgModule, `@Input`, `@Output` i rodzic standalone |
| Wydajność | Szczegóły i podsumowanie | `NgOptimizedImage`, `@defer`, OnPush |

Pliki JSON w `public/assets` zastępują API na potrzeby nauki odczytu HTTP. Zapis formularza modyfikuje pamięć serwisu, nie plik ani serwer; odświeżenie przywraca dane początkowe. Nie przedstawiamy tego jako produkcyjnego backendu.

Wygląd zapewnia gotowy motyw Material 3 Azure/Blue. Checkbox i slide toggle prezentują stan logiczny. Pola, wiersza listy i przyciski mają standardowy wygląd biblioteki.

Kod tej części znajduje się na branchu `part-2`.

## Podział komponentów

- `ItemsListComponent`: kolekcja, filtrowanie, wybór oraz nagłówki tabeli.
- `ItemComponent`: cały wiersz produktu, pipe ceny i dostępności, kategoria i akcja wyboru.
  Dane płyną przez `input()`, zdarzenie wraca przez `output()` — odpowiedniki kontraktu
  `@Input()` / `@Output()` spotykane także w utrzymywanych projektach.
- `MainPageComponent`: kompozycja; licznik i demonstracja dyrektywy mają własne komponenty.
  Są dostępne pod `/basics`; lista HTTP pozostaje na `/items`, aby nie dublować jej na stronie podstaw.
- `StockToggleComponent` i `InventorySummaryComponent`: samodzielne, małe elementy widoku.

`ItemComponent` ma selektor `tr[app-item]`: komponent jest samym wierszem tabeli,
a jego szablon zawiera komórki. Pętla `@for` tworzy takie wiersze, `@empty` obsługuje brak wyników.
Zachowujemy natywny układ pięciu kolumn, kontrolki Material i tokeny gotowego motywu.
Selektor atrybutowy nie zmienia komponentu w dyrektywę.
Dokumentacja: [selektory](https://angular.dev/guide/components/selectors),
[control flow](https://angular.dev/guide/templates/control-flow).

## Konwencje przykładów szkoleniowych

- Widok każdego komponentu znajduje się w osobnym pliku `.html`, wskazanym przez `templateUrl`.
- Powtarzalne opcje i elementy menu definiujemy jako typowane tablice danych i renderujemy przez `@for` ze stabilnym kluczem `track`.
- Stałe listy opcji nie wymagają sygnałów; sygnał przechowuje zmieniający się wybór użytkownika.
- Zależności i zachowanie komponentu pozostają w `.ts`, aby łatwo porównywać logikę z widokiem podczas szkolenia.
- Komentarze wyjaśniają działanie elementu. Kontekst legacy opisuje składnię i organizację kodu; numer wersji podajemy tylko dla zweryfikowanej granicy dostępności lub zmiany zachowania API.

## Jak czytać konfigurację Angulara 22

Wszystkie komponenty aplikacji mają osobne pliki HTML. Niewielkie komponenty pomocnicze
w testach mogą używać inline template, aby scenariusz testu był widoczny w jednym miejscu.
Komponenty są domyślnie standalone od Angulara 19; `standalone: false` wskazuje komponent
deklarowany w NgModule. Jawne `standalone: true` nadal jest poprawne.

OnPush jest domyślną strategią Angulara 22. W `ItemsListComponent` pozostaje jawna
deklaracja jako przykład składni spotykanej również w starszym kodzie. Pozostałe
komponenty korzystają z wartości domyślnej. Dawna strategia `Default` ma teraz nazwę
`Eager`; `Default` jest przestarzałym aliasem. [Strategie sprawdzania widoku](https://angular.dev/api/core/ChangeDetectionStrategy).

Zoneless jest domyślne od Angulara 21. Angular otrzymuje powiadomienia m.in. przez
zmiany sygnałów odczytanych w szablonie i obsługę zdarzeń. W projektach z Zone.js
spotkasz `provideZoneChangeDetection` oraz `NgZone`; Zone.js śledzi zdarzenia i zadania
asynchroniczne jako sygnały do synchronizacji aplikacji. OnPush i zoneless dotyczą
różnych aspektów aktualizacji widoku. `ChangeDetectorRef.markForCheck()` może być
przydatne również w zoneless; `detectChanges()` uruchamia sprawdzenie widoku.
Nie trzeba dodawać tych wywołań po każdym `signal.set()`. [Zoneless](https://angular.dev/guide/zoneless).

Wersję projektu sprawdzaj w `package.json` i lockfile. Sama obecność NgModule,
dekoratorów Input/Output czy jawnego standalone nie pozwala określić wieku aplikacji.

Zasoby statyczne umieszczamy w `public/`; `angular.json` kopiuje je do wyniku builda.
Część 2 pobiera JSON z `public/assets` pod adresami `/assets/items.json` i `/assets/empty.json`.
Nie potrzebuje plików environments ani drugiego katalogu zasobów. W starszych
konfiguracjach możesz spotkać `src/assets` i builder `@angular-devkit/build-angular:browser`;
tutaj używamy `@angular/build:application`. Katalog assets jest konfigurowalny,
więc jego nazwa sama nie identyfikuje buildera ani wersji Angulara.

## Serwis, HTTP i stany widoku

`CatalogService` używa `@Service()` zgodnie z generatorem Angulara 22. Automatyczna
dostępność serwisu przez DI pozwala współdzielić pamięć edycji pomiędzy stronami.
`@Injectable({ providedIn: 'root' })` pozostaje poprawnym zapisem. Lokalny wpis
`providers: [CatalogService]` w komponencie stworzyłby osobną instancję i inną pamięć
edycji — dlatego nie dodajemy go do poszczególnych stron. [Service](https://angular.dev/api/core/Service).

`provideHttpClient()` używa domyślnie fetch. `withFetch()` jest deprecated;
`withXhr()` pozwala wybrać XHR. Interceptor dodaje demonstracyjny nagłówek wyłącznie
do adresów zaczynających się od `/assets/`. W przykładach używaj więc `/assets/items.json`,
z początkowym ukośnikiem. [Konfiguracja HTTP](https://angular.dev/guide/http/setup),
[withFetch](https://angular.dev/api/common/http/withFetch).

`ListState` rozróżnia loading, success i error. `@let current = state()` nadaje
lokalną nazwę wynikowi, a `@switch` wybiera wariant. `map` tworzy success,
`startWith` emituje loading, a `catchError` zwraca przez `of` stan error.
Obsługa błędu jest wewnątrz `switchMap`, więc kolejna zmiana scenariusza nadal działa.
`toSignal` utrzymuje jedną subskrypcję i sprząta ją przy zniszczeniu komponentu.
[Zmienne w szablonie](https://angular.dev/guide/templates/variables),
[RxJS interop](https://angular.dev/ecosystem/rxjs-interop).

Przy odczytywaniu starszego kodu rozpoznawaj także Subject + takeUntil lub ręczne
unsubscribe w ngOnDestroy, klasowe guardy i interceptory rejestrowane przez DI.
Nie oznacza to automatycznie usuniętych API. `CanActivate` nadal jest stabilnym interfejsem;
funkcje guardów pozwalają wyrazić tę samą rolę prościej. Nie myl zakończenia pojedynczego
HTTP z czasem życia strumienia parametrów trasy. [CanActivate](https://angular.dev/api/router/CanActivate),
[takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed).

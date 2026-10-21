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
| Lifecycle | `/lifecycle` | Zmiana input, usunięcie i odtworzenie dziecka, konsola |
| Bezpieczeństwo | `/security` | Interpolacja i sanityzowany HTML |
| Starsze projekty | `/legacy` | NgModule, `@Input`, `@Output` i rodzic standalone |
| Wydajność | Szczegóły i podsumowanie | `NgOptimizedImage`, `@defer`, OnPush |

Pliki JSON w `src/assets` zastępują API na potrzeby nauki odczytu HTTP. Zapis formularza modyfikuje pamięć serwisu, nie plik ani serwer; odświeżenie przywraca dane początkowe. Nie przedstawiamy tego jako produkcyjnego backendu.

Wygląd zapewnia gotowy motyw Material 3 Azure/Blue. Checkbox i slide toggle prezentują stan logiczny. Pola, wiersza listy i przyciski mają standardowy wygląd biblioteki.

Zmiany pozostają niezacommitowane w osobnym katalogu roboczym brancha `part-2`. Commity i publikację wykonuje prowadząca.

## Podział komponentów

- `ItemsListComponent`: kolekcja, filtrowanie, wybór oraz nagłówki tabeli.
- `ItemComponent`: cały wiersz produktu, pipe ceny i dostępności, kategoria i akcja wyboru.
  Dane płyną przez `input()`, zdarzenie wraca przez `output()` — odpowiedniki kontraktu
  `@Input()` / `@Output()` z wersji 2025.
- `MainPageComponent`: kompozycja; licznik i demonstracja dyrektywy mają własne komponenty.
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
- Komentarze wyjaśniają działanie elementu.Kontekst legacy opisuje składnię i organizację kodu; numer wersji podajemy tylko dla zweryfikowanej granicy dostępności lub zmiany zachowania API.

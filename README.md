# Angular od podstaw — część 1

Kod demonstracji do szkolenia 2026. Angular 22.2.3, Angular Material 22.2.3, signals i komponenty standalone. Materiał dla osób znających podstawy HTML i JavaScript.

Przed zajęciami wykonaj [instrukcję przygotowania środowiska](PRZYGOTOWANIE-SRODOWISKA.md). Obejmuje instalację narzędzi od zera i instrukcje dla agenta AI.

```sh
npm ci
npm start
```

Otwórz adres podany w terminalu. Na Windows PowerShell możesz używać `npm.cmd`. Do kontroli kodu: `npm run check` (ESLint, Vitest, build produkcyjny).

## Mapa demonstracji

| Temat | Kod | Co sprawdzić w aplikacji |
|---|---|---|
| Komponent i binding | `src/app/features/signal-counter/` | Kliknij licznik, zobacz widok i konsolę |
| `signal`, `computed`, niemutowalność | `src/app/features/items/items-list/` | Wyszukaj produkt i zwiększ zapas dostawą |
| `input`, `output` | `src/app/features/items/item/` | Wybierz produkt, obserwuj stan rodzica |
| `model` | `src/app/shared/stock-toggle/` | Przełącz „Tylko dostępne” |
| Control flow | Szablony listy i produktu | Wyszukaj nieistniejącą nazwę, porównaj kategorie |
| Pipes | `src/app/shared/pipes/` | Opis dostępności i cena w PLN |
| Dyrektywy | `src/app/shared/directives/` | Fokus na wierszu listy i checkbox dodatkowego fragmentu |
| `@defer` | `src/app/features/items/inventory-summary/` | Kliknij przycisk podsumowania |

Gotowy motyw Material 3 Azure/Blue jest w `styles` w `angular.json`. Własny CSS określa rozmieszczenie elementów. Importy modułów Material w komponentach standalone to biblioteka UI, nie rezygnacja ze standalone.

Komentarze w kodzie wiążą przykłady z tematami prezentacji. [Opcjonalne prompty do Copilota](COPILOT-OPCJONALNIE.md) pomagają wyjaśniać kod i planować sprawdzenia. Copilot nie jest wymagany.

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

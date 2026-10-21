# Część 2 — punkty kontrolne demonstracji

Kolejność zgodna z agendą. Nie wykonujemy wszystkich zmian od zera: pokazujemy działające
fragmenty i modyfikujemy małe elementy. Całe spotkanie z przerwami i buforem: 285 minut.

| Blok | Otwórz w kodzie | Pokaż w aplikacji | Pytanie do uczestników |
|---|---|---|---|
| Serwisy i DI | `core/services/catalog.service.ts` | Lista oraz szczegóły korzystają ze wspólnych danych | Kto powinien odpowiadać za pobieranie danych? |
| HTTP i RxJS | `features/items/items-list/items-list.component.ts` | Normalny, pusta odpowiedź, błąd HTTP i powrót do normalnego | Czy pusta tablica oznacza błąd? |
| Routing | `app.routes.ts`, `features/items/item-details/` | Nazwa produktu otwiera szczegóły; `/items/999` pokazuje brak produktu | Czym różni się parametr od danych produktu? |
| Reactive Forms | `features/items/item-edit/` | Pusta nazwa, same spacje, cena -1, ilość 1.5; potem poprawne wartości i zapis | Dlaczego zero jest poprawne? |
| Guards | `core/guards/` | Zmień nazwę bez zapisu, kliknij Powrót i anuluj. Następnie potwierdź wyjście | Czy guard zabezpiecza dane na serwerze? |
| Interceptor | `core/interceptors/training.interceptor.ts` | W DevTools sprawdź X-Training-Demo żądania `/assets/items.json` | Dlaczego używamy clone? |
| Bezpieczeństwo | `features/security/` | Zestaw tekst interpolowany z HTML; sprawdź usunięty onerror w DOM | Kto weryfikuje uprawnienia do danych? |
| Legacy | `features/legacy/` | Licznik z NgModule i dekoratorami | Co pozostaje takie samo w przepływie input/output? |
| Wydajność | `app.routes.ts`, `features/items/inventory-summary/` | Lazy route i podsumowanie po interakcji | Co ładuje się od razu, a co później? |
| Lifecycle | `features/lifecycle/` | Zmień tekst, usuń dziecko, przywróć je; porównaj logi | Czy przywrócone dziecko jest tą samą instancją? |

## Zapis i ograniczenia demonstracji

Zapis działa w pamięci wspólnego serwisu. Po przejściu do szczegółów i listy zmiany pozostają,
po odświeżeniu strony wraca JSON. To nie jest zapis HTTP ani trwały backend.
Guard sprawdza zmianę trasy, nie zamknięcie karty. Nie jest mechanizmem autoryzacji.

Na szybkim lokalnym serwerze loading może być widoczny bardzo krótko. Do demonstracji można
ustawić wolniejsze połączenie w DevTools, a po przykładzie przywrócić normalną prędkość.

## Sprawdzenia automatyczne

`npm run check` uruchamia lint, testy i build. Testy obejmują:

- odzyskanie listy i formularza po błędzie HTTP;
- kolumny produktu, link szczegółów, wybór i dostępność;
- walidację pól, zapis w pamięci i zachowanie formularza po nieudanym zapisie;
- odrzucenie niepoprawnego id oraz zgodę/anulowanie wyjścia z formularza;
- zakres nagłówka interceptora, aktualizację i zniszczenie dziecka lifecycle;
- sanityzację HTML oraz własne dyrektywy i pipe.

Testy bezpieczeństwa pokazują wybrane zachowanie Angulara, nie stanowią audytu bezpieczeństwa aplikacji.

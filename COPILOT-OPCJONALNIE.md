# Copilot jako pomoc w nauce

To opcjonalne uzupełnienie. Konto Copilot i płatny model nie są wymagane do szkolenia ani ćwiczeń. Wszystkie zadania można wykonać samodzielnie. Linki pozostają w materiałach i na slajdach, nie w interfejsie demonstracyjnej aplikacji.

## Małe zadanie, mały kontekst

Do wyjaśnienia jednej funkcji, utworzenia kilku fikcyjnych produktów lub zaproponowania przypadków testowych warto zacząć od modelu o niższym koszcie dostępnego na swoim koncie, np. modelu z rodziny **GPT mini** lub **Claude Haiku**. To propozycja doboru do prostego zadania, nie gwarancja jakości ani stałej ceny.

Przed szkoleniem prowadząca sprawdza aktualny selektor modeli, limity konta i politykę organizacji. Dostępność zależy od planu, klienta i ustawień administratora. Nie wpisujemy na slajdzie stałego przelicznika kosztów: GitHub opisuje różne zasady dla aktualnego rozliczania i starszych planów. Mniejszy kontekst oraz jedno precyzyjne pytanie pomagają ograniczyć ilość przetwarzanych danych.

W VS Code otwórz Chat, wybierz model (jeśli plan daje taki wybór) i dołącz wskazany plik. Zacznij od rozmowy wyjaśniającej, bez automatycznej edycji projektu. Wariant automatyczny może sam wybierać model, więc nie gwarantuje wykorzystania konkretnej rodziny.

## Przykłady do materiału

### Część 1: dane do sprawdzenia filtra

Przy temacie `Item` i `computed`, około 2 minut w istniejącym bloku signals:

```text
Kontekst: Angular 22.2.3, TypeScript 6.0. Przeczytaj Item oraz filteredItems.
Zaproponuj 6 fikcyjnych produktów zgodnych z interfejsem Item, z unikalnymi id.
Uwzględnij polskie znaki, nazwę z odstępami i quantity=0.
Zwróć dane oraz 4 ręczne przypadki sprawdzenia filtra z oczekiwanym wynikiem.
Nie modyfikuj plików ani zależności. Nie zmieniaj warunków filtrowania.
```

Najpierw uczestnik sam przewiduje wynik dla ` MYSZ ` i przełącznika dostępności. Potem porównuje odpowiedź z aplikacją. Typy nie zastępują sprawdzenia sensu danych.

### Część 1: wyjaśnienie przepływu danych

```text
Przeczytaj ItemComponent i ItemsListComponent. Wytłumacz początkującej osobie,
co dzieje się po kliknięciu Wybierz. Użyj nazw input, output, emit i signal,
ale każdą wyjaśnij jednym zdaniem. Wskaż konkretne miejsca w kodzie.
Nie proponuj refaktoryzacji i nie dopisuj API, którego nie ma w plikach.
```

Sprawdzamy w kodzie, czy dziecko rzeczywiście emituje identyfikator, a rodzic aktualizuje `selectedId`. Wyjaśnienie powinno odpowiadać naszej implementacji.

### Część 2: tabela przypadków walidacji

Przy Reactive Forms, około 2 minut w istniejącym bloku formularzy:

```text
Przeczytaj definicję form w ItemEditComponent. Zaproponuj tabelę przypadków
dla name, price i quantity: wartość, oczekiwany błąd lub brak błędu, uzasadnienie.
Uwzględnij puste pole, same spacje, cenę ujemną, quantity=0 i quantity=1.5.
Nie zmieniaj walidatorów. Oddziel wymagania istniejące od własnych sugestii.
```

Porównujemy tabelę z walidatorami i interfejsem. Np. zero sztuk jest dozwolone, ułamkowa liczba sztuk nie. Jeśli model sugeruje inne wymaganie, to propozycja, nie opis działającego kodu.

### Część 2: propozycja testu obsługi błędu

```text
Przeczytaj strumień state w ItemsListComponent. Opisz test scenariusza:
HTTP zwraca błąd, użytkownik zmienia tryb na normalny, pojawiają się produkty.
Najpierw podaj kroki i oczekiwany wynik, bez kodu. Wyjaśnij, dlaczego położenie
catchError ma znaczenie. Używamy Angular 22 i Vitest, nie Jasmine.
```

Nie akceptujemy testu, który sprawdza wyłącznie istnienie komponentu. Sprawdzamy powrót do działania po błędzie.

## Jak korzystać z odpowiedzi

Przeczytaj propozycję, porównaj ją z wymaganiem i kodem, sprawdź użyte API w dokumentacji, a po ewentualnej zmianie uruchom `npm run check`. Build nie dowodzi poprawności wszystkich zachowań; sprawdź także opisany scenariusz w przeglądarce. Jeżeli odpowiedź nie pasuje, zawęź pytanie i podaj konkretny błąd zamiast od razu zlecać agentowi przebudowę całego projektu.

Do szkoleniowych promptów używamy fikcyjnych danych z repozytorium. W pracy stosuj zasady organizacji dotyczące udostępniania kodu. Przykłady nie potrzebują sekretów, tokenów ani danych klientów.

## Źródła do sprawdzenia przed szkoleniem

- [Dostępne modele i wymagania klientów Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [Plany GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans)
- [Wybór modelu w Copilot Chat](https://docs.github.com/en/copilot/how-tos/use-ai-models/change-the-chat-model)
- [Angular: signals](https://angular.dev/guide/signals)
- [Angular: walidacja formularzy](https://angular.dev/guide/forms/form-validation)
- [Angular: testowanie HTTP](https://angular.dev/guide/http/testing)

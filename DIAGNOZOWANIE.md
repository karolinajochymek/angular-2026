# Jak szukać przyczyny błędu

1. Uruchom `npm start`. Najpierw przeczytaj pierwszy błąd kompilacji w terminalu: plik, linia i nazwa pola. Angular Language Service pomaga znaleźć błąd szablonu w edytorze.
2. Otwórz narzędzia przeglądarki (F12). W Console sprawdź pierwszy błąd i jego stos. Ostrzeżenie nie zawsze jest przyczyną awarii.
3. W Network odtwórz akcję. Dla HTTP sprawdź adres, status i Response; status 200 z pustą tablicą jest innym przypadkiem niż 404. W części 1 sprawdź pobranie kodu po kliknięciu podsumowania @defer; ta część nie pobiera listy przez HTTP.
4. Angular DevTools pozwala obejrzeć drzewo komponentów podczas pracy w trybie developerskim. Ustal, kto posiada stan, zanim zaczniesz go zmieniać.
5. Zmień jeden warunek i ponów próbę. `npm test` sprawdza zachowanie; `npm run build` sprawdza również szablony.

## Krótka demonstracja testu

Otwórz `src/app/shared/pipes/stock-label.pipe.spec.ts`. Przewidź wynik dla 0, 3 i 4. Uruchom `npm test`. Tymczasowo zmień jedno oczekiwanie, przeczytaj expected/received i przywróć poprawne oczekiwanie. Nie zmieniaj implementacji, aby dopasować ją do błędnego testu.

## Pomoc AI (opcjonalna)

Prompt: „Wyjaśnij ten komunikat błędu Angulara. Wskaż możliwe przyczyny i najmniejszy krok weryfikacji; nie przepisuj komponentu. [komunikat i minimalny fragment bez sekretów]”. Do takiego ograniczonego zadania można wybrać dostępny tańszy model. Sprawdź wynik w kodzie i dokumentacji; narzędzie nie jest wymagane.

## Konfiguracja środowiska

Adres API może być konfiguracją środowiska; pliki środowiskowe Angulara trafiają do kodu klienta i nie przechowują sekretów. Zamiana plików przy buildzie nie jest automatycznie konfiguracją runtime. Nasze przykłady używają lokalnych zasobów, więc nie wymagają konta ani kluczy API.

Źródła: https://angular.dev/tools/devtools · https://angular.dev/tools/language-service · https://angular.dev/guide/testing · https://angular.dev/tools/cli/environments

# Środowisko do szkolenia Angular 2026

Wykonaj tę instrukcję **przed szkoleniem**. Pierwsza instalacja może zająć 30–60 minut, dłużej, jeśli potrzebna jest pomoc firmowego IT. Na zajęciach otworzymy gotową aplikację i omówimy strukturę projektu. Nie będziemy instalować narzędzi krok po kroku.

Instrukcja dotyczy Angulara **22.2.3** i Angular Material **22.2.3**. Repozytorium zawiera dokładne wersje w `package-lock.json`. Zalecany Node.js: **24.19.0** (linia 24 LTS). Nie instaluj po prostu najnowszego Node bez sprawdzenia zgodności. Wymagania Angulara 22: Node `^22.22.3 || ^24.15.0 || >=26.0.0`, TypeScript `>=6.0 <6.1`.

## 1. Co będzie potrzebne

| Narzędzie | Do czego służy | Skąd je pobrać |
|---|---|---|
| Aktualna przeglądarka Edge, Chrome lub Firefox | Otwieranie aplikacji i narzędzi deweloperskich | Na Windows Edge zwykle jest już zainstalowany |
| Node.js 24 LTS z npm | Uruchamianie narzędzi projektu i pobieranie bibliotek | [Oficjalne instalatory Node.js](https://nodejs.org/en/download) |
| Git | Pobranie repozytorium i wybór części szkolenia | [Git](https://git-scm.com/downloads) |
| Visual Studio Code | Edycja kodu i terminal | [Visual Studio Code](https://code.visualstudio.com/download) |
| Angular Language Service | Podpowiedzi i błędy w szablonach HTML | Rozszerzenia VS Code, wydawca Angular, identyfikator `Angular.ng-template` |

Nie potrzebujesz Dockera, Javy, bazy danych, osobnego backendu ani globalnej instalacji TypeScript. Część 2 pobiera lokalne pliki JSON przez HTTP. Zapis formularza działa w pamięci aplikacji do odświeżenia strony.

## 2. Sprawdzenie narzędzi

```powershell
node --version
npm.cmd --version
git --version
code --version
```

Oczekiwane: Node `v24.19.0` albo zgodna aktualizacja linii 24 LTS, numery wersji npm i Git, numer wersji VS Code. Gdy `code` nie jest rozpoznawane, możesz otworzyć folder z menu VS Code; nie blokuje to szkolenia. Gdy nie ma `node`, `npm` lub `git`, zakończ ten etap naprawą instalacji lub PATH.

Nie ustawiaj globalnie innej wersji Node, jeśli utrzymujesz inne projekty. Użyj istniejącego menedżera wersji; plik `.nvmrc` wskazuje wersję tego szkolenia. Na komputerze bez wcześniejszych projektów wystarczy instalator.

## 3. Pobranie materiałów

**Uwaga organizacyjna:** zaktualizowany kod jest obecnie przygotowywany lokalnie przez prowadzącą i nie został jeszcze opublikowany. Poniższe klonowanie branchy zadziała po ich publikacji. Do tego czasu skorzystaj z otrzymanej od prowadzącej paczki właściwej części i rozpakuj ją do nowego folderu. Nie zmieniaj branchy w katalogu prowadzącej z niezapisanymi zmianami.

Windows, PowerShell:

```powershell
git clone  https://github.com/karolinajochymek/angular-2026.git 
```
Branch part-1 zawiera repozytorium ktore bedzie uzywane na cz1 szkolenia, part-2 na cz2.

## 4. Instalacja bibliotek i uruchomienie

Otwórz terminal w folderze zawierającym `package.json`, `package-lock.json` i `angular.json`. To katalog projektu, nie jego rodzic ani `src`.

```powershell
npm.cmd ci
npm.cmd start
```

`npm ci` pobiera biblioteki według lockfile do `node_modules`. Wymaga internetu, nie powinno zmieniać lockfile. `npm start` uruchamia lokalny serwer; terminal pozostaje zajęty. Otwórz adres podany w terminalu, zwykle `http://localhost:4200`. Zatrzymujesz serwer przez `Ctrl+C`.

W drugim terminalu możesz wykonać kontrolę:

```powershell
npm.cmd run check
```

Polecenie uruchamia lint, testy i build. Sukces oznacza kod zakończenia `0`. Ten projekt korzysta z lokalnego Angular CLI, więc nie trzeba instalować `ng` globalnie.

Część 2 uruchom analogicznie z jej folderu po `npm ci`. Gdy część 1 nadal działa, wybierz inny port:

```powershell
npm.cmd start -- --port 4201
```

## 5. Gdy chcesz stworzyć własny projekt od zera

To opcjonalna praktyka przed zajęciami. Nie wykonuj jej wewnątrz pobranego repozytorium. W nowym katalogu roboczym:

```powershell
npx.cmd @angular/cli@22.2.3 new moj-angular --routing --style=scss --standalone --ssr=false --skip-git --defaults
Set-Location moj-angular
npx.cmd ng add @angular/material@22.2.3
```

Zaakceptuj instalację Material. W konfiguracji wybierz gotowy motyw Azure/Blue, jeżeli CLI wyświetli wybór motywu. Jeżeli generator zaproponuje własny motyw, do odwzorowania szkolenia użyj `@angular/material/prebuilt-themes/azure-blue.css` w tablicy `styles` w `angular.json`; unikaj równoczesnego ładowania dwóch motywów. Aktualne opcje schematu można sprawdzić poleceniem `npx.cmd ng add @angular/material@22.2.3 --help`.

```powershell
npm.cmd start
```

Własny projekt ma początkowy ekran Angulara, a nie gotową listę produktów ze szkolenia. `--skip-git` pomija inicjalizację Git i ewentualny początkowy commit generatora. Importy komponentów Material dodajesz później do komponentów, które ich używają.

## 6. Typowe problemy

| Objaw | Co sprawdzić |
|---|---|
| `node` / `npm` nierozpoznane | Nowy terminal po instalacji; na Windows `where.exe node`, `where.exe npm` |
| `npm.ps1 cannot be loaded` | Użyj `npm.cmd`, bez zmiany ExecutionPolicy |
| Node zbyt stary / `EBADENGINE` | `node --version`, `.nvmrc`, zgodność z Angular 22 |
| `ENOENT ... package.json` | Aktualny folder: `Get-Location` i `Get-ChildItem` (macOS/Linux: `pwd`, `ls`) |
| Port 4200 zajęty | Zatrzymaj własny poprzedni serwer lub użyj `--port 4201`; nie zabijaj nieznanego procesu |
| Problemy sieciowe / certyfikat / proxy | Sprawdź VPN i internet, przekaż IT komunikat. Nie ustawiaj `strict-ssl=false` |
| Błąd instalacji zależności | Zachowaj log i wersje Node/npm, wyślij prowadzącej. Nie używaj `--force` ani `--legacy-peer-deps` |
| npm informuje o blokowanych install scripts | Zachowaj listę pakietów. Sprawdź, czy build działa. Jeśli nie, skonsultuj konkretny pakiet; nie włączaj globalnie wszystkich skryptów |
| Material nie ma wyglądu | Sprawdź wpis motywu w `angular.json` i uruchom serwer ponownie |
| Zmiany formularza znikają po odświeżeniu | To oczekiwane w lokalnej demonstracji bez backendu |

Nie usuwaj lockfile jako pierwszego kroku naprawy. Nie wykonuj `npm audit fix --force` w trakcie przygotowania szkolenia.

## 7. Lista gotowości

- [ ] Node ma zgodną wersję, npm i Git działają.
- [ ] VS Code otwiera właściwy folder; Angular Language Service działa.
- [ ] `npm ci` zakończyło się poprawnie w każdej części.
- [ ] Część 1: widać listę produktów, wyszukiwanie i przełącznik „Tylko dostępne”.
- [ ] Część 2: lista, szczegóły i edycja działają; zapis jest demonstracyjny.
- [ ] `npm run check` kończy się sukcesem.
- [ ] Potrafię otworzyć konsolę przeglądarki (F12 / Inspect) i zatrzymać serwer (Ctrl+C).

## 8. Instrukcje dla pomagającego agenta AI

Wklej poniższy tekst jako zadanie. Uczestnik pozostaje osobą zatwierdzającą instalacje systemowe:

> Pomóż przygotować środowisko do Angular 22.2.3 zgodnie z tym dokumentem. Najpierw ustal system operacyjny, architekturę, aktualny katalog i zainstalowane wersje Node/npm/Git. Sprawdź package.json, package-lock.json, .nvmrc i git status. Nie nadpisuj istniejącego projektu, nie usuwaj plików, nie commituj i nie pushuj zmian. Nie przełączaj brancha z lokalnymi zmianami. Nie instaluj nic globalnie ani nie zmieniaj PATH, proxy, TLS lub polityk systemu bez poinformowania użytkownika i jego zgody. Dla nowego komputera poprowadź instalację oficjalnych narzędzi. W repo użyj npm ci i lokalnych skryptów, bez aktualizowania wersji bibliotek. Po instalacji wykonaj npm run check i uruchom aplikację na wolnym lokalnym porcie. Nie twierdź, że aplikacja działa tylko na podstawie startu procesu: sprawdź stronę i podstawowe interakcje. Jeśli nie masz narzędzi do wykonania kroku, podaj polecenie użytkownikowi i poproś o wynik. Na końcu podaj wersje, wyniki, adres aplikacji i nierozwiązane problemy. Nie proś o hasła ani tokeny.

Kryterium zakończenia dla agenta: wszystkie punkty gotowości sprawdzone albo jawnie oznaczone jako niewykonane. Nie uruchamiaj automatycznych commitów ani generatora tworzącego commit.

## Źródła

- [Zgodność wersji Angular / Node / TypeScript](https://angular.dev/reference/versions)
- [Lokalne środowisko Angular](https://angular.dev/tools/cli/setup-local)
- [Angular CLI: ng new](https://angular.dev/cli/new)
- [Angular Material: rozpoczęcie pracy](https://material.angular.dev/guide/getting-started)
- [Angular Material: motywy](https://material.angular.dev/guide/theming)
- [VS Code na Windows](https://code.visualstudio.com/docs/setup/windows)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)

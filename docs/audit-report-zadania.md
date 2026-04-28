# Audit Report: wew-21-zadania-25@solutions-1

> Generated: 2026-04-28 | Auditor: GitHub Copilot (Angular 21 migration instruction)

## 1. Repository snapshot

| Field | Value |
|---|---|
| Repo URL | https://github.com/karolinajochymek/wew-21-zadania-25 |
| Branch | solutions-1 (default) |
| Commit SHA analyzed | 6104b9dcd1b565d5521bd4db973a9431e448d74a |
| Total files (.ts/.html/.scss) | 33 (19 .ts / 9 .html / 5 .scss) |
| Components count | 4 (AppComponent, MainPageComponent, UnoptimalizedItemsListComponent, ItemComponent) |
| Services count | 0 |
| Directives count | 3 (ColorChangeDirective, CheckPermissionDirective, SimpleCheckPermissionDirective) |
| Pipes count | 4 (LowPricePipe, FullStockPipe, UpperCaseByLastIndxPipe, TextGeneratorPipe) |
| Modules count | 1 (AppModule — flat; no feature modules) |
| Routes count | 0 (no routing configured) |

---

## 2. Angular version & dependency analysis

**Current `@angular/core` version:** `^18.2.0`  
**Current TypeScript version:** `~5.5.2`  
**Node engine constraint:** not specified in `package.json`

**Angular packages (current):**

| Package | Version |
|---|---|
| `@angular/animations` | ^18.2.0 |
| `@angular/common` | ^18.2.0 |
| `@angular/compiler` | ^18.2.0 |
| `@angular/core` | ^18.2.0 |
| `@angular/forms` | ^18.2.0 |
| `@angular/platform-browser` | ^18.2.0 |
| `@angular/platform-browser-dynamic` | ^18.2.0 |
| `@angular/router` | ^18.2.0 |
| `@angular-devkit/build-angular` | ^18.2.12 |
| `@angular/cli` | ^18.2.12 |
| `@angular/compiler-cli` | ^18.2.0 |
| `@angular/localize` | ^18.2.0 |

**Notable differences vs `wew-21-cz01-25`:**
- `@angular/material` and `@angular/cdk` are **not present** in this repo
- `eslint` and `typescript-eslint` are **not present** — no linting configured (see §8)

**Third-party deps requiring Angular 21 compatibility verification:**

| Package | Current | Status |
|---|---|---|
| `rxjs` | ~7.8.0 | Compatible with Angular 21 — no change required |
| `@ng-bootstrap/ng-bootstrap` | ^17.0.1 | v17 targets Angular 18 — **compatibility with Angular 21 unconfirmed** (see §8) |
| `bootstrap` | ^5.3.2 | CSS-only; compatible — no change required |
| `zone.js` | ~0.14.10 | Must upgrade to ~0.15.x; or remove if adopting `provideZonelessChangeDetection()` |
| `jasmine-core` | ~5.2.0 | Remove when migrating to Vitest |
| `karma` + reporters | ~6.4.0 | Remove — Karma is deprecated in Angular 21 |

**Recommended target versions for `package.json`:**

| Package | Target |
|---|---|
| `@angular/*` (all) | ^21.2.0 |
| `@angular/cli` | ^21.2.0 |
| `@angular-devkit/build-angular` | ^21.2.0 |
| `typescript` | ~5.8.x |
| `zone.js` | remove (zoneless) or ~0.15.x |
| `rxjs` | ~7.8.0 (unchanged) |
| `@ng-bootstrap/ng-bootstrap` | verify — see §8 |
| jasmine/karma packages | remove |
| `vitest` | ^3.x |
| `@analogjs/vitest-angular` | ^1.x |
| `eslint` + `typescript-eslint` | add (missing from this repo) |

---

## 3. Architecture inventory

| Path | Type | Standalone? | Uses NgModule? | Uses \*ngIf/\*ngFor? | Uses @Input/@Output? | Uses Observables? | Uses inject()? |
|---|---|---|---|---|---|---|---|
| `src/app/app.component.ts` | Component | No | Yes (AppModule) | No | No | No | No |
| `src/app/main-page/main-page.component.ts` | Component | No | Yes (AppModule) | No (`*appSimpleCheckPermission` in html) | No | No | No |
| `src/app/unoptimalized-items-list/unoptimalized-items-list.component.ts` | Component | No | Yes (AppModule) | `*ngFor` (html-1-3, html-1-5), `ngModel` (html-1-5) | No | No | No |
| `src/app/unoptimalized-items-list/item/item.component.ts` | Component | No | Yes (AppModule) | `*ngIf` (html:1) | `@Input` | No | No |
| `src/app/directives/color-change.directive.ts` | Directive | No | Yes (AppModule) | No | `@Input` (setter) | No | No |
| `src/app/directives/check-permission.directive.ts` | Directive | No | Yes (AppModule) | No | `@Input` (setter) ×2 | No | No |
| `src/app/directives/simple-check-permission.directive.ts` | Directive | No | Yes (AppModule) | No | `@Input` (setter) | No | No |
| `src/app/pipes/low-price.pipe.ts` | Pipe | No | Yes (AppModule) | No | No | No | No |
| `src/app/pipes/full-stock.pipe.ts` | Pipe | No | Yes (AppModule) | No | No | No | No |
| `src/app/pipes/upper-case-by-last-indx.pipe.ts` | Pipe | No | Yes (AppModule) | No | No | No | No |
| `src/app/pipes/text-generator.pipe.ts` | Pipe | No | Yes (AppModule) | No | No | No | No |
| `src/app/models/item.ts` | Interface | N/A | No | No | No | No | No |

**Notes:**
- `angular.json` builder: `@angular-devkit/build-angular:application` — esbuild-based. Not Webpack.
- `tsconfig.json`: `strict: true` ✓, `experimentalDecorators: true` ✓, `strictStandalone` not present.
- `app.config.ts`: **not present**. All providers are in `AppModule`.
- `app.routes.ts`: **not present**. No routing is configured.
- `main.ts`: `platformBrowserDynamic().bootstrapModule(AppModule)` — legacy bootstrap.
- `UnoptimalizedItemsListComponent` has **5 HTML template variants** (`*.component.html`, `*-1-1.html`, `*-1-2.html`, `*-1-3.html`, `*-1-5.html`) with the active one selected via `templateUrl` comment-switching. This is an intentional exercise pattern — earlier steps are preserved as commented-out solutions.
- `app.component.spec.ts` uses `declarations: [AppComponent]` (NgModule test pattern, not standalone `imports`). Additionally, the test expects title `'wew21-2023-zadania'` but `AppComponent.title` is `'wew21-zadania'` — **spec will fail**.
- `TextGeneratorPipe` and `UpperCaseByLastIndxPipe` are used in a long pipe chain in `item.component.html:13`. `TextGeneratorPipe` calls `Math.random()` on every `transform()` — effectively impure, not decorated `pure: false`.
- `ItemComponent.ngOnInit` calls `generateRandomNumbersArray` to set `upperIndexes` — reactive initialization in lifecycle hook.
- No services, no routing, no guards, no HTTP in this repo (exercise scope is part-1 topics only).

---

## 4. Anti-pattern catalog (vs Angular 21)

### A. Module-based architecture

**`src/app/app.module.ts:1–40`** → Flat `@NgModule` that declares all 4 components, 3 directives, 4 pipes in a single module — no feature modules, no routing module → Each declaration becomes standalone; module file is deleted; `main.ts` switches to `bootstrapApplication`:

```typescript
// Angular 21 — main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

```typescript
// Angular 21 — app.config.ts (minimal, no routing for this scope)
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()]
};
```

**`src/main.ts:4–6`** → `platformBrowserDynamic().bootstrapModule(AppModule)` → See snippet above.

**`src/app/app.module.ts:33–35`** → `NgbModule` in imports — not used in any located template (`<ngb-*>` tags absent). Remove unless ng-bootstrap components are used in exercise solutions not yet present on this branch.

---

### B. Legacy control flow

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component-1-3.html:19`** → `*ngFor="let item of items"` → Angular 21 `@for` with mandatory `track`:

```html
@for (item of items; track item.no) {
  <li class="list-group-item">
    <app-item [item]="item" />
  </li>
}
```

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component-1-5.html:22,26`** → `*ngFor="let item of filteredItems"` with `appColorChange` directive and multiple commented `[ngClass]` variants → Angular 21 `@for` with `track`; keep solution comment variants intact for teaching:

```html
@for (item of filteredItems(); track item.no) {
  <!-- rozwiązanie 4.1: [class.clicked]="$odd" -->
  <!-- rozwiązanie 4.2: [class.clicked]="$even" -->
  <!-- rozwiązanie 4.3: [class.clicked]="$first" -->
  <!-- rozwiązanie 4.4: [class.clicked]="$last" -->
  <li class="list-group-item" appColorChange>
    <app-item [item]="item" />
  </li>
}
```

Note: `@for` provides `$odd`, `$even`, `$first`, `$last`, `$index` as built-in implicit variables — replaces `*ngFor` local template variable aliases (`odd as isOdd` etc.). This is a teaching upgrade.

**`src/app/main-page/main-page.component.html:11`** → `*appSimpleCheckPermission="firstPermission"` — structural directive applied directly in template. No `@if` equivalent since this is a custom structural directive. The pattern itself is valid Angular; however, for a single boolean gate, the simpler Angular 21 alternative is just `@if (firstPermission)`. The directive still has migration value for teaching custom structural directives. Leave directive in place; add `@if` as the recommended first approach, directive as the advanced pattern.

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component.html`** (base, solution 0) → Row data hardcoded as static HTML, no `*ngFor`. This is the "before" baseline — intentional. No migration needed in the base file.

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component-1-5.html:5`** → `[(ngModel)]='filter'` → still valid in Angular 21 with `FormsModule` imported directly in the component. No syntax migration needed; note that the signal-based equivalent is `model()`.

---

### C. Decorator-based I/O

**`src/app/unoptimalized-items-list/item/item.component.ts:12`** → `@Input() item: Item = {}` → `input<Item>({})`:

```typescript
import { Component, OnInit, input } from '@angular/core';
import { Item } from '../../models/item';

export class ItemComponent {
  readonly item = input<Item>({});
  upperIndexes: number[] = [];

  // ngOnInit still needed here for upperIndexes initialization
  // (see §G for the signal-based alternative)
}
```

**`src/app/directives/color-change.directive.ts:11`** → `@Input() set appColorChange(color: string)` → `input<string>()` + `effect()` for reactive color tracking:

```typescript
import { Directive, ElementRef, HostListener, input, effect, inject } from '@angular/core';

@Directive({ selector: '[appColorChange]' })
export class ColorChangeDirective {
  readonly appColorChange = input<string>('red');
  private readonly el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.color = this.appColorChange() || 'red';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.color = 'black';
  }
}
```

**`src/app/directives/check-permission.directive.ts:13,16`** → `@Input()` setters ×2 → `input()` ×2 + `effect()`:

```typescript
import { Directive, TemplateRef, ViewContainerRef, input, effect, inject } from '@angular/core';

@Directive({ selector: '[appCheckPermission]' })
export class CheckPermissionDirective {
  readonly appCheckPermission = input<boolean>(false);
  readonly appCheckPermissionSecondPermission = input<boolean>(false);

  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.appCheckPermission() && this.appCheckPermissionSecondPermission()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
```

**`src/app/directives/simple-check-permission.directive.ts:10`** → `@Input() set appSimpleCheckPermission` → `input<boolean>(false)` + `effect()`:

```typescript
import { Directive, TemplateRef, ViewContainerRef, input, effect, inject } from '@angular/core';

@Directive({ selector: '[appSimpleCheckPermission]' })
export class SimpleCheckPermissionDirective {
  readonly appSimpleCheckPermission = input<boolean>(false);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      if (this.appSimpleCheckPermission()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
```

---

### D. Class-based guards/resolvers

(none found — no guards or resolvers in this repo)

---

### E. Constructor DI

**`src/app/main-page/main-page.component.ts:13`** → `constructor() {}` — empty, no DI. Remove.

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component.ts:47`** (implicit) → Empty `constructor() {}`. Remove.

**`src/app/unoptimalized-items-list/item/item.component.ts:15`** → `constructor() {}` — empty, no DI. Remove.

**`src/app/directives/color-change.directive.ts:8`** → `constructor(private el: ElementRef)` → `inject(ElementRef)` (see §C snippet above).

**`src/app/directives/check-permission.directive.ts:11`** → `constructor(private templateRef, private viewContainer)` → `inject()` (see §C snippet above).

**`src/app/directives/simple-check-permission.directive.ts:8`** → `constructor(private templateRef, private viewContainer)` → `inject()` (see §C snippet above).

---

### F. Manual subscription management

(none found — no `subscribe()` calls, no `Observable` usage anywhere in this repo)

---

### G. Lifecycle hooks doing reactive work

**`src/app/unoptimalized-items-list/item/item.component.ts:17–19`** → `ngOnInit()` used to set `upperIndexes` via random number generation:

```typescript
ngOnInit(): void {
  this.upperIndexes = generateRandomNumbersArray(0, 4, generateRandomNumber(1, 5));
}
```

This is reactive initialization tied to component creation. Angular 21 equivalent: initialize at field declaration (runs at construction time, no lifecycle hook needed), or use a signal:

```typescript
import { signal } from '@angular/core';
import { generateRandomNumber, generateRandomNumbersArray } from '../../utils/pseudo-random-generator';

export class ItemComponent {
  readonly item = input<Item>({});
  readonly upperIndexes = signal(generateRandomNumbersArray(0, 4, generateRandomNumber(1, 5)));
  // No ngOnInit needed — signal is initialized at field declaration
}
```

**`src/app/main-page/main-page.component.ts:15–16`** → `ngOnInit(): void {}` — empty, remove.

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component.ts:51–53`** → Both `ngOnInit(): void {}` and `ngOnDestroy(): void {}` are empty. Remove both. Note: `ngOnDestroy` is present without `implements OnDestroy` — class only `implements OnInit`. Minor TypeScript interface omission.

---

### H. Missing performance primitives

**All 4 components** → No `changeDetection: ChangeDetectionStrategy.OnPush` on any component. Required for correct behavior under `provideZonelessChangeDetection()`.

```typescript
@Component({
  selector: 'app-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component-1-5.html`** → `*ngFor` iterates `filteredItems` — no `@defer` blocks. For training: `ItemComponent` per row is a candidate for `@defer (on viewport)`:

```html
@for (item of filteredItems(); track item.no) {
  @defer (on viewport) {
    <li class="list-group-item" appColorChange>
      <app-item [item]="item" />
    </li>
  } @placeholder {
    <li class="list-group-item">…</li>
  }
}
```

**`src/app/unoptimalized-items-list/item/item.component.html`** → No image rendering despite `item.imageUrl` being populated in static data. Images present in `UnoptimalizedItemsListComponent` data but not displayed in `ItemComponent` template. When added, use `NgOptimizedImage`:

```html
<img [ngSrc]="item().imageUrl!" width="200" height="150" [alt]="item().name" />
```

---

### I. Security gaps

**`src/app/unoptimalized-items-list/unoptimalized-items-list.component.ts:23–38`** → `imageUrl` values are hardcoded Wikimedia Commons URLs (external domains). When these are rendered with `<img>`, they load cross-origin images with no origin policy enforcement. Use `NgOptimizedImage` with `withNoopImageLoader()` to enforce `width`/`height` attributes and avoid layout shift.

**No `[innerHTML]` bindings** found in any template — not a risk.

**No XSRF, no HttpClient** — not applicable to this scope.

**`src/app/app.component.spec.ts:2–22`** → Spec expects title `'wew21-2023-zadania'` but component has `title = 'wew21-zadania'`. Test will throw assertion failure at runtime. **This is a stale spec from a prior year's repo — it references files and selectors that do not exist** (`compiled.querySelector('.content span')`). Must be corrected before any student runs `ng test`.

**No ESLint configured** — the `package.json` has no `eslint` script and no ESLint devDependencies. Code quality checks that the training repos enforce (e.g., detection of `*ngIf`, `*ngFor`, unused imports) will not run here. Add ESLint + `typescript-eslint` to align with training repos.

---

## 5. Migration plan (ordered)

**Step 1 — Upgrade dependencies to Angular 21**

- **Goal:** Bring all Angular packages, CLI, and tooling to 21.2.x; add missing `eslint` + `typescript-eslint`
- **Command:**
```bash
ng update @angular/core@21 @angular/cli@21
```
- **Manual fixes after schematic:** Update `typescript` to `~5.8.x`. Remove or update `zone.js`. Add `eslint`, `typescript-eslint`, `@eslint/js`, `globals` to match `wew-21-cz01-25` devDependencies. Copy `eslint.config.mjs` from `wew-21-cz01-25`.
- **Verification:** `ng build` — expect 0 errors; `npx eslint . --ext .ts`

---

**Step 2 — Migrate to standalone components**

- **Goal:** Convert all 4 components, 3 directives, 4 pipes to standalone; delete `AppModule`; create `app.config.ts`; wire `main.ts` to `bootstrapApplication`
- **Command:**
```bash
ng generate @angular/core:standalone
```
- **Manual fixes after schematic:** Create `app.config.ts` with `provideZonelessChangeDetection()`. Each component must explicitly import the directives, pipes, and `FormsModule` it uses. Remove `@angular/platform-browser-dynamic` from `package.json`.
- **Verification:** `ng build` + `ng serve`; verify homepage renders with items list visible

---

**Step 3 — Migrate legacy control flow**

- **Goal:** Replace `*ngFor` (in `-1-3.html` and `-1-5.html`), `*ngIf` (in `item.component.html`), `[ngClass]` with `@for (track)`, `@if`, `[class]`
- **Command:**
```bash
ng generate @angular/core:control-flow
```
- **Manual fixes after schematic:** Verify `track item.no` on `@for`. Replace `[ngClass]` with `[class.clicked]`. **Preserve** the commented-out solution variants (`rozwiązanie 4.1–4.4`) in HTML — update them to use `@for` built-in variables (`$odd`, `$even`, `$first`, `$last`). Remove all `<ng-container>` wrappers replaced by `@if`. The base `.component.html` (hardcoded rows, no loop) does not need control flow migration — leave it as base exercise state.
- **Verification:** `ng build`; all 3 items render with filter working; `appColorChange` directive active on hover

---

**Step 4 — Migrate `@Input` to `input()` signals**

- **Goal:** Replace `@Input() item: Item` in `ItemComponent`; replace `@Input` setters in all 3 directives
- **Command:**
```bash
ng generate @angular/core:signal-input-migration
```
- **Manual fixes after schematic:** Update `item.component.html` references from `item.x` to `item().x`. Migrate directive `@Input` setters to `input()` + `effect()` (see §C snippets). Update `ngOnInit` in `ItemComponent` to use signal initialization at field level (see §G snippet).
- **Verification:** `ng build`; items render, hover color change works, permission directive shows/hides items list

---

**Step 5 — Migrate signal queries**

- **Goal:** Migrate any `@ViewChild` / `@ContentChild` to `viewChild()` / `contentChild()`
- **Command:**
```bash
ng generate @angular/core:signal-queries-migration
```
- **Manual fixes after schematic:** None expected (no `@ViewChild`/`@ContentChild` found)
- **Verification:** `ng build`

---

**Step 6 — Migrate `@Output` to `output()`**

- **Goal:** No `@Output` present in this repo
- **Command:** N/A
- **Manual fixes:** None required
- **Verification:** N/A

---

**Step 7 — Update routing**

- **Goal:** No routing in this repo; confirm `app.routes.ts` is created empty or left absent
- **Command:** N/A
- **Manual fixes:** If routing is planned for future exercises on this branch, create `app.routes.ts` with empty array and add `provideRouter(routes)` to `app.config.ts`. Otherwise leave absent.
- **Verification:** N/A

---

**Step 8 — Guards/resolvers**

- **Goal:** No guards in this repo
- **Command:** N/A
- **Manual fixes:** None required
- **Verification:** N/A

---

**Step 9 — HTTP**

- **Goal:** No `HttpClient` in this repo
- **Command:** N/A
- **Manual fixes:** None required
- **Verification:** N/A

---

**Step 10 — Performance primitives**

- **Goal:** Add `ChangeDetectionStrategy.OnPush` to all 4 components; add `@defer` example on item row; update `imageUrl` rendering to `NgOptimizedImage`
- **Command:** Manual
- **Manual fixes:** Add `OnPush` to all component decorators. Add `@defer (on viewport)` around `<app-item>` in active template (`-1-5.html`). Add `NgOptimizedImage` rendering of `item().imageUrl` in `item.component.html` (currently not displayed). Import `NgOptimizedImage` in `ItemComponent`.
- **Verification:** `ng build --configuration production`

---

**Step 11 — Replace Karma with Vitest**

- **Goal:** Remove Karma; configure Vitest; fix broken spec
- **Command:**
```bash
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
npm install -D vitest @analogjs/vitest-angular
```
- **Manual fixes:** Create `vitest.config.ts`. Fix `app.component.spec.ts`: change `declarations: [AppComponent]` to `imports: [AppComponent]`; fix expected title from `'wew21-2023-zadania'` to `'wew21-zadania'`; remove `.content span` selector test. Fix `main-page.component.spec.ts` and others similarly.
- **Verification:** `npx vitest run` — all specs pass

---

**Step 12 — Cleanup unused imports**

- **Goal:** Remove empty constructors, empty lifecycle hooks, unused `OnInit` implements; remove `NgbModule` if confirmed unused
- **Command:**
```bash
ng generate @angular/core:cleanup-unused-imports
```
- **Manual fixes:** Remove empty `constructor()` from `MainPageComponent`, `UnoptimalizedItemsListComponent`, `ItemComponent`. Remove `ngOnInit()` from `MainPageComponent` and `UnoptimalizedItemsListComponent`. Remove `ngOnDestroy()` from `UnoptimalizedItemsListComponent`. Remove `implements OnInit` from `MainPageComponent` and `UnoptimalizedItemsListComponent`. Confirm `NgbModule` removal.
- **Verification:** `ng build`; `eslint . --ext .ts` — 0 warnings

---

**Step 13 — Zoneless change detection**

- **Goal:** Replace any Zone.js-based CD with `provideZonelessChangeDetection()`
- **Command:** Manual (already set in `app.config.ts` if created per step 2 above)
- **Manual fixes:** Remove `zone.js` from `angular.json` polyfills. Remove `zone.js` from `package.json`. Ensure all 4 components have `ChangeDetectionStrategy.OnPush`.
- **Verification:** `ng build`; full manual test — items list renders, filter toggles, checkbox hides/shows list

---

## 6. New project skeleton (proposed structure)

```
src/
├── main.ts
│   # bootstrapApplication(AppComponent, appConfig)
│   # Exercise tie-in: Exercise 0 — project structure orientation
│
├── index.html
│   # App shell; no inline scripts
│
└── app/
    ├── app.config.ts
    │   # provideZonelessChangeDetection()
    │   # (provideRouter + provideHttpClient added if future exercises require it)
    │   # Exercise tie-in: Exercise 0 — how standalone bootstrap works
    │
    ├── app.component.ts / .html / .scss
    │   # Root standalone component: <app-main-page>
    │   # Exercise tie-in: Exercise 0
    │
    ├── models/
    │   └── item.ts
    │   # Exercise tie-in: Exercise 1 — Item interface with all fields (no, name, qty, price, %, date, imageUrl)
    │
    ├── utils/
    │   └── pseudo-random-generator.ts
    │   # Pure utility functions; no Angular dependency
    │   # Exercise tie-in: Exercise 3* — pipe chaining with random text
    │
    ├── shared/
    │   # Standalone reusable pipes and directives; imported directly by consumer components
    │   # Exercise tie-in: Exercises 2–3 (pipes), Exercises 5–7 (directives)
    │   ├── pipes/
    │   │   ├── low-price.pipe.ts          # Exercise 3.1
    │   │   ├── full-stock.pipe.ts         # Exercise 3.1
    │   │   ├── upper-case-by-last-indx.pipe.ts  # Exercise 3*
    │   │   └── text-generator.pipe.ts     # Exercise 3*
    │   └── directives/
    │       ├── color-change.directive.ts        # Exercise 6 — attribute directive
    │       ├── check-permission.directive.ts    # Exercise 7 — structural directive (dual input)
    │       └── simple-check-permission.directive.ts  # Exercise 7 — structural directive (single input)
    │
    └── features/
        ├── main-page/
        │   # Exercise tie-in: Exercise 1 — binding checkbox to firstPermission; *appSimpleCheckPermission usage
        │   ├── main-page.component.ts
        │   ├── main-page.component.html
        │   └── main-page.component.scss
        │
        └── items/
            # Exercise tie-in: Exercises 1–7 (progressive enhancement of items list)
            ├── items-list/
            │   # Contains all solution HTML variant files (*-1-1, *-1-2, *-1-3, *-1-5)
            │   ├── unoptimalized-items-list.component.ts   # base + extended with filter getter
            │   ├── unoptimalized-items-list.component.html # base (hardcoded rows — exercise starting point)
            │   ├── unoptimalized-items-list.component-1-1.html  # solution 1.1: <app-item [item]={...}>
            │   ├── unoptimalized-items-list.component-1-2.html  # solution 1.2: items[index]
            │   ├── unoptimalized-items-list.component-1-3.html  # solution 1.3: *ngFor / @for
            │   ├── unoptimalized-items-list.component-1-5.html  # solution 1.5+: filter, @for, appColorChange
            │   └── unoptimalized-items-list.component.scss
            └── item/
                # Exercise tie-in: Exercise 1.1 (@Input item), Exercises 2–3 (pipe usage), Exercises 3* (upperIndexes)
                ├── item.component.ts
                ├── item.component.html   # @if, pipe chain, commented solution variants
                └── item.component.scss
```

---

## 7. Breaking changes & teaching implications

**No routing in this repo**  
`wew-21-zadania-25` exercises are scoped to part-1 content only (components, templates, pipes, directives, data binding). Students are not expected to configure routing here. After Angular 21 migration, `app.config.ts` will exist but providers list stays minimal — this is a good teaching point: `app.config.ts` is where features are opt-in.

**`*ngFor` built-in variables (`odd`, `even`, `first`, `last`, `index`) change syntax in `@for`**  
The exercise solution variants 4.1–4.4 use `*ngFor` with `odd as isOdd`, `even as isEven`, etc. In `@for`, these are implicit variables `$odd`, `$even`, `$first`, `$last`, `$index` — no aliasing needed. This simplifies the syntax and should be highlighted explicitly in the updated solution comments.

**`*appSimpleCheckPermission` structural directive usage is preserved**  
The custom structural directive is applied as `*appSimpleCheckPermission="firstPermission"` in the template. This syntax is still valid in Angular 21 — no migration needed for the usage syntax. The implementation migrates from `@Input` setter to `input()` + `effect()` internally. Students must understand that the template usage is unchanged while the implementation pattern changes.

**`ngOnInit` for `upperIndexes` initialization**  
`ItemComponent` uses `ngOnInit` to generate random `upperIndexes`. In Angular 21, this moves to field-level signal initialization. Students see that `ngOnInit` is no longer needed for synchronous initialization — only for deferred or async work (and even then, signals/`effect()` are preferred).

**`AppComponent.title` mismatch in spec**  
The test file references `'wew21-2023-zadania'` — an artifact from a prior year's exercise repo copy. This is not a framework migration issue but a maintenance debt. Fix it as part of step 11 (test migration). Students should not see failing tests on checkout.

**No linting in this repo**  
`wew-21-cz01-25` has ESLint configured but `wew-21-zadania-25` does not. Students solving exercises will not get linting feedback. Adding ESLint (step 1) aligns the exercise repo with the training repo and enables `ng lint` as a verification step.

**What can stay identical:** Template binding syntax, `[(ngModel)]` with `FormsModule`, pipe usage syntax (`| lowPrice:item.price`), directive usage syntax (`appColorChange`, `*appSimpleCheckPermission`), `@HostListener`. The pipe `transform()` function signature is unchanged.

**Prerequisite ordering:** The same as `wew-21-cz01-25@part-1` — signals concept must precede `input()` migration. For this repo, `effect()` must be introduced before showing the migrated directive implementations.

---

## 8. Open questions for instructor

1. **`@ng-bootstrap/ng-bootstrap` is imported in `AppModule` but no `<ngb-*>` component tags appear in any template.** Is `NgbModule` included for future exercises not yet committed to this branch, or is it a leftover from project setup? If unused, remove it from `app.module.ts` (and later from `package.json`) to reduce bundle size and simplify migration.

2. **Multiple HTML template variants per component (`*-1-1.html`, `*-1-2.html`, `*-1-3.html`, `*-1-5.html`) are in the same folder.** The active template is selected via commented/uncommented `templateUrl` lines. This is a non-standard teaching pattern. In Angular 21, there is no built-in mechanism to switch templates at build time via comments. Options: (a) keep the pattern and document it as "manually switch the comment to see each solution"; (b) use separate component files per solution step; (c) use a route per solution. Which approach fits the exercise workflow?

3. **Exercise numbering has a gap: there is no solution `1-4.html`.** Is exercise 1.4 intentionally skipped, or is the file missing from this branch?

4. **`app.component.spec.ts` is stale** — references `'wew21-2023-zadania'` (prior year) and a `.content span` selector that does not exist in the current `app.component.html` (which is just `<app-main-page>`). Should this spec be fixed as part of the migration, or replaced with a meaningful test for the current component behavior?

5. **No ESLint configured.** Should ESLint be added to this repo as part of the Angular 21 migration, or is the exercise repo intentionally kept simpler than the training repo to reduce tooling noise for students?

6. **`UnoptimalizedItemsListComponent.ngOnDestroy` is empty and the class does not `implements OnDestroy`.** This is either a leftover from a copy-paste or a placeholder for a future exercise. If it is intentional (planned subscription teardown exercise to be added), document it; otherwise remove.

7. **`imageUrl` is populated in the static data but never rendered in `item.component.html`.** Is the intent to add image rendering as a future exercise (e.g., a `NgOptimizedImage` exercise), or were images added to the data model for completeness only?

8. **Zoneless readiness:** Same question as `wew-21-cz01-25@part-1` — for an introductory exercise repo, should `provideZonelessChangeDetection()` be adopted from Angular 21 migration, or should Zone.js be retained to keep change detection invisible to beginners?

# Audit Report: wew-21-cz01-25@part-1

> Generated: 2026-04-28 | Auditor: GitHub Copilot (Angular 21 migration instruction)

## 1. Repository snapshot

| Field | Value |
|---|---|
| Repo URL | https://github.com/karolinajochymek/wew-21-cz01-25 |
| Branch | part-1 |
| Commit SHA analyzed | 2e169a621d7d01b13158dc5379dbb67bf2b98c5b |
| Total files (.ts/.html/.scss) | 25 (15 .ts / 5 .html / 5 .scss) |
| Components count | 4 (AppComponent, MainPageComponent, ItemsListComponent, ItemComponent) |
| Services count | 0 |
| Directives count | 0 (custom) |
| Pipes count | 0 (custom); 2 built-in used: `currency`, `ngClass` |
| Modules count | 1 (AppModule) |
| Routes count | 0 (empty `routes` array) |

---

## 2. Angular version & dependency analysis

**Current `@angular/core` version:** `^18.2.0`  
**Current TypeScript version:** `~5.5.2`  
**Node engine constraint:** not specified in `package.json`

**Angular packages (current):**

| Package | Version |
|---|---|
| `@angular/animations` | ^18.2.0 |
| `@angular/cdk` | ^18.2.14 |
| `@angular/common` | ^18.2.0 |
| `@angular/compiler` | ^18.2.0 |
| `@angular/core` | ^18.2.0 |
| `@angular/forms` | ^18.2.0 |
| `@angular/material` | ^18.2.14 |
| `@angular/platform-browser` | ^18.2.0 |
| `@angular/platform-browser-dynamic` | ^18.2.0 |
| `@angular/router` | ^18.2.0 |
| `@angular-devkit/build-angular` | ^18.2.12 |
| `@angular/cli` | ^18.2.12 |
| `@angular/compiler-cli` | ^18.2.0 |
| `@angular/localize` | ^18.2.0 |

**Third-party deps requiring Angular 21 compatibility verification:**

| Package | Current | Status |
|---|---|---|
| `rxjs` | ~7.8.0 | Compatible with Angular 21 — no change required |
| `@angular/material` | ^18.2.14 | Must upgrade to ^21.x |
| `@angular/cdk` | ^18.2.14 | Must upgrade to ^21.x |
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
| `@analogjs/vitest-angular` | ^1.x (Angular Vitest integration) |

---

## 3. Architecture inventory

| Path | Type | Standalone? | Uses NgModule? | Uses \*ngIf/\*ngFor? | Uses @Input/@Output? | Uses Observables? | Uses inject()? |
|---|---|---|---|---|---|---|---|
| `src/app/app.component.ts` | Component | No | Yes (declared in AppModule) | No | No | No | No |
| `src/app/main-page/main-page.component.ts` | Component | No | Yes (declared in AppModule) | No | No | No | No |
| `src/app/items-list/items-list.component.ts` | Component | No | Yes (declared in AppModule) | `*ngFor` (html:18), `ngModel` (html:4) | No | No | No |
| `src/app/items-list/item/item.component.ts` | Component | No | Yes (declared in AppModule) | `*ngIf` (html:1), `[ngClass]` (html:2) | `@Input`, `@Output` | No | No |
| `src/app/app.module.ts` | NgModule | N/A | — (is the module) | No | No | No | No |
| `src/app/models/item.ts` | Interface | N/A | No | No | No | No | No |

**Notes:**
- `app.config.ts` is present with `provideZoneChangeDetection`, `provideRouter`, `provideAnimationsAsync` — but **is not referenced in `main.ts`** and has no effect at runtime.
- `app.routes.ts` defines an empty `Routes` array and is unused.
- `app.component.ts` imports `RouterOutlet` but does not use it in the template and has no `imports` array (not standalone) — unused import.
- All four spec files use `TestBed.configureTestingModule({ imports: [ComponentName] })` — the standalone-style test pattern — but the components are **not** standalone. Tests will fail at runtime.

---

## 4. Anti-pattern catalog (vs Angular 21)

### A. Module-based architecture

**`src/app/app.module.ts:1–26`** → Entire `@NgModule` declaration block (declarations, imports, bootstrap) → Replace with `bootstrapApplication(AppComponent, appConfig)` in `main.ts`; each component becomes standalone and imports its own dependencies directly.

```typescript
// Angular 21 — main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

**`src/main.ts:1–4`** → `platformBrowserDynamic().bootstrapModule(AppModule)` → See snippet above.

**`src/app/app.module.ts:8`** → `NgbModule` imported into NgModule → Not needed after going standalone; ng-bootstrap components are imported per component.

**`src/app/app.module.ts:9`** → `FormsModule` imported globally into NgModule → Import `FormsModule` directly in the component that needs it (`ItemsListComponent`).

**`src/app/app.module.ts:10`** → `CommonModule` imported globally → Not needed in standalone components; `@if`/`@for` are built-in; `AsyncPipe`, `NgClass` etc. can be imported individually per component if needed transitionally.

---

### B. Legacy control flow

**`src/app/items-list/item/item.component.html:1`** → `*ngIf="item && item.no"` → Angular 21 `@if`:

```html
@if (item && item.no) {
  <div class="row" [ngClass]="{'clicked': item.isClicked}">
    <div class="col">{{item.no}}</div>
    <div class="col">{{item.name}}</div>
    <div class="col">{{item.price | currency:'USD':'symbol'}}</div>
    <div class="col">{{item.quantity}}</div>
    <a class="col blue" (click)="onClick()">Click here</a>
  </div>
}
```

**`src/app/items-list/items-list.component.html:18`** → `*ngFor="let item of filteredItems"` → Angular 21 `@for` with mandatory `track`:

```html
@for (item of filteredItems; track item.no) {
  <li class="list-group-item">
    <app-item [item]="item" (clickedItem)="onClickedItem($event)" />
  </li>
}
```

**`src/app/items-list/items-list.component.html:4`** → `[(ngModel)]='filter'` → `ngModel` two-way binding is still valid syntax in Angular 21 with `FormsModule` imported; signal-based equivalent uses `model()`:

```typescript
// Angular 21 signal equivalent
filter = model('');
```

```html
<input type="text" [(ngModel)]="filter" />
```

---

### C. Decorator-based I/O

**`src/app/items-list/item/item.component.ts:10`** → `@Input() item: Item = {};` → `input<Item>()` signal:

```typescript
import { input } from '@angular/core';
import { Item } from '../../models/item';

// inside ItemComponent class:
readonly item = input<Item>({});
```

**`src/app/items-list/item/item.component.ts:11`** → `@Output() clickedItem = new EventEmitter<number>();` → `output<number>()`:

```typescript
import { output } from '@angular/core';

// inside ItemComponent class:
readonly clickedItem = output<number>();

onClick(): void {
  if (this.item()?.no) {
    this.clickedItem.emit(this.item().no!);
  }
}
```

---

### D. Class-based guards/resolvers

(none found)

---

### E. Constructor DI

**`src/app/main-page/main-page.component.ts:11`** → Empty `constructor() {}` — not injecting anything; constructor should be removed. If DI is later added, use `inject()`:

```typescript
// Angular 21 — when DI is required:
import { inject } from '@angular/core';
import { SomeService } from '../core/some.service';

export class MainPageComponent {
  private readonly someService = inject(SomeService);
}
```

---

### F. Manual subscription management

(none found — no `subscribe()` calls or `Observable` usage in any component)

---

### G. Lifecycle hooks doing reactive work

**`src/app/main-page/main-page.component.ts:13–15`** → `ngOnInit(): void {}` — empty lifecycle hook with no body. Should be removed. If reactive work is added later, use `effect()` or `computed()` instead of `ngOnInit`:

```typescript
// Angular 21 — reactive side-effect
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    // reacts to signal changes automatically
  });
}
```

---

### H. Missing performance primitives

**All components** → No `changeDetection: ChangeDetectionStrategy.OnPush` set on any component. In Angular 21 with `provideZonelessChangeDetection()`, `OnPush` is required for correct re-rendering behavior.

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

**`src/app/items-list/items-list.component.html`** → No `@defer` blocks. `ItemComponent` is a candidate for deferred loading demonstration:

```html
@defer (on viewport) {
  <app-item [item]="item" (clickedItem)="onClickedItem($event)" />
} @placeholder {
  <div>Loading item...</div>
}
```

**`src/app/items-list/item/item.component.html`** → No `NgOptimizedImage` usage. `item.ts` model has `imageUrl?: string` field (unused). When images are added:

```html
<img [ngSrc]="item().imageUrl" width="100" height="100" />
```

---

### I. Security gaps

- No `[innerHTML]` bindings found in any template — not currently a risk.
- No `HttpClient` usage in part-1 — XSRF not applicable.
- No CSP guidance in `index.html` (no meta tags) or server config. Recommend introducing CSP when HTTP/XSS topic is covered in part-2.
- `src/assets/data.settings.json` — contents not verified; confirm no credentials or API keys stored in static assets.

---

## 5. Migration plan (ordered)

**Step 1 — Upgrade dependencies to Angular 21**

- **Goal:** Bring all Angular packages, CLI, and tooling to 21.2.x
- **Command:**
```bash
ng update @angular/core@21 @angular/cli@21
ng update @angular/material@21 @angular/cdk@21
```
- **Manual fixes after schematic:** Verify `@ng-bootstrap/ng-bootstrap` compatibility (see §8). Update `typescript` to `~5.8.x`. Remove or update `zone.js` depending on zoneless decision.
- **Verification:** `ng build` — expect 0 errors; `ng lint`

---

**Step 2 — Migrate to standalone components**

- **Goal:** Convert all 4 NgModule-declared components to standalone; remove `AppModule`; wire `main.ts` to use `bootstrapApplication`
- **Command:**
```bash
ng generate @angular/core:standalone
```
- **Manual fixes after schematic:** Confirm `app.config.ts` is correctly referenced in `main.ts`. Remove `@angular/platform-browser-dynamic` dependency. Add `imports` arrays to each component.
- **Verification:** `ng build` + `ng serve`; `ng lint`

---

**Step 3 — Migrate legacy control flow**

- **Goal:** Replace `*ngIf`, `*ngFor`, `[ngClass]` with `@if`, `@for (track)`, `[class]`
- **Command:**
```bash
ng generate @angular/core:control-flow
```
- **Manual fixes after schematic:** Verify `track` expression uses `item.no`. Review `ng-container` wrappers removed correctly.
- **Verification:** `ng build` + visual check in browser

---

**Step 4 — Migrate `@Input` to `input()` signals**

- **Goal:** Replace `@Input() item: Item` in `ItemComponent` with `input<Item>()`
- **Command:**
```bash
ng generate @angular/core:signal-input-migration
```
- **Manual fixes after schematic:** Update all template references from `item.x` to `item().x` within `ItemComponent`. Update `onClick()` method.
- **Verification:** `ng build`; check template bindings in `items-list.component.html`

---

**Step 5 — Migrate signal queries**

- **Goal:** Migrate any `@ViewChild` / `@ContentChild` to `viewChild()` / `contentChild()`
- **Command:**
```bash
ng generate @angular/core:signal-queries-migration
```
- **Manual fixes after schematic:** None expected (no `@ViewChild` found in part-1)
- **Verification:** `ng build`

---

**Step 6 — Migrate `@Output` to `output()`**

- **Goal:** Replace `@Output() clickedItem = new EventEmitter<number>()` with `output<number>()`
- **Command:**
```bash
ng generate @angular/core:signal-event-migration
```
- **Manual fixes after schematic:** Confirm `.emit()` call syntax unchanged. Remove `EventEmitter` import.
- **Verification:** `ng build`; click interaction must still work

---

**Step 7 — Update routing**

- **Goal:** Confirm `app.routes.ts` is the routing source; confirm `provideRouter(routes)` is in `app.config.ts`
- **Command:** Manual
- **Manual fixes:** `app.config.ts` already has `provideRouter(routes)` — confirm correct reference. When routes are added, use `loadComponent` for lazy loading.
- **Verification:** `ng build`

---

**Step 8 — Guards/resolvers**

- **Goal:** Ensure no class-based guards are introduced
- **Command:** N/A (none present in part-1)
- **Manual fixes:** When guards are introduced in part-2, use functional guard pattern only.
- **Verification:** N/A

---

**Step 9 — HTTP**

- **Goal:** N/A for part-1 (no `HttpClient` usage)
- **Command:** N/A
- **Manual fixes:** In part-2, use `httpResource()` for new data-fetching code.
- **Verification:** N/A

---

**Step 10 — Performance primitives**

- **Goal:** Add `changeDetection: ChangeDetectionStrategy.OnPush` to all components; demonstrate `@defer`
- **Command:** Manual
- **Manual fixes:** Add `ChangeDetectionStrategy.OnPush` to all 4 component decorators. Add a `@defer (on viewport)` example to `items-list.component.html`.
- **Verification:** `ng build --configuration production`

---

**Step 11 — Replace Karma with Vitest**

- **Goal:** Remove Karma; configure Vitest with `@analogjs/vitest-angular`
- **Command:**
```bash
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
npm install -D vitest @analogjs/vitest-angular
```
- **Manual fixes:** Create `vitest.config.ts`; update `angular.json` test builder; update `tsconfig.spec.json`. Fix spec files (currently broken against non-standalone components).
- **Verification:** `npx vitest run` — all 4 `should create` tests pass

---

**Step 12 — Cleanup unused imports**

- **Goal:** Remove `CommonModule`, `BrowserModule`, unused `RouterOutlet`, `@angular/platform-browser-dynamic`
- **Command:**
```bash
ng generate @angular/core:cleanup-unused-imports
```
- **Manual fixes:** Remove `RouterOutlet` from `app.component.ts` or add router-outlet to template.
- **Verification:** `ng build`; `ng lint` — 0 warnings

---

**Step 13 — Zoneless change detection**

- **Goal:** Replace `provideZoneChangeDetection({ eventCoalescing: true })` with `provideZonelessChangeDetection()`
- **Command:** Manual edit to `app.config.ts`

```typescript
// app.config.ts — Angular 21 zoneless
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
```

- **Manual fixes:** Remove `zone.js` from `angular.json` polyfills. Remove `zone.js` from `package.json`.
- **Verification:** `ng build`; full manual click and filter interaction test; `ng lint`

---

## 6. New project skeleton (proposed structure)

```
src/
├── main.ts
│   # bootstrapApplication(AppComponent, appConfig)
│   # Lesson tie-in: Lesson 1 — "How Angular starts"
│
├── index.html
│   # App shell; no inline scripts (CSP-safe)
│
└── app/
    ├── app.config.ts
    │   # provideZonelessChangeDetection(), provideRouter(routes), provideAnimationsAsync()
    │   # Lesson tie-in: Lesson 1 — application-level providers
    │
    ├── app.routes.ts
    │   # Top-level Routes array; loadComponent() for lazy feature routes
    │   # Lesson tie-in: Part-2 routing lesson
    │
    ├── app.component.ts / .html / .scss
    │   # Root standalone component; contains <router-outlet> or direct child components
    │   # Lesson tie-in: Lesson 1 — root component
    │
    ├── core/
    │   # Application-wide singletons: services, HTTP interceptors, functional guards
    │   # Injectable services with providedIn: 'root'
    │   # Lesson tie-in: Part-2 — Services & DI, HTTP interceptors, guards
    │   └── guards/
    │       # Functional guards (plain functions) only — no class-based
    │
    ├── shared/
    │   # Reusable standalone components, pipes, directives imported directly by consumers
    │   # Purely presentational / utility — nothing here is providedIn root
    │   # Lesson tie-in: Lesson 3 — reusable components; Lesson 4 — custom pipes & directives
    │   ├── pipes/
    │   └── directives/
    │
    └── features/
        ├── main-page/
        │   # MainPageComponent (standalone)
        │   # Lesson tie-in: Lesson 2 — property binding, event binding, class/style binding
        │   ├── main-page.component.ts
        │   ├── main-page.component.html
        │   └── main-page.component.scss
        │
        └── items/
            # Feature: items list + item detail
            # Lesson tie-in: Lesson 3 — input()/output(), @for with track, @if, @defer
            ├── items-list/
            │   ├── items-list.component.ts
            │   ├── items-list.component.html
            │   └── items-list.component.scss
            ├── item/
            │   ├── item.component.ts
            │   ├── item.component.html
            │   └── item.component.scss
            └── models/
                └── item.ts   # Item interface
```

---

## 7. Breaking changes & teaching implications

**NgModule removal**  
Students who learned Angular 2–18 will expect a central `app.module.ts` declaring all components. In Angular 21 there is no module file — each component declares its own `imports`. Introduce "standalone component" as the mental model in Lesson 1 before showing any `@Component` decorator.

**`standalone: true` flag**  
Since v19, `standalone: true` is the default and the flag is optional. Students may encounter older tutorials requiring the flag — clarify this is legacy documentation, and the flag should be omitted in new code.

**`@if` / `@for` vs `*ngIf` / `*ngFor`**  
The structural directive syntax (`*`) is still parsed but discouraged; schematics will migrate it. Students must learn the `@` block syntax as the primary form. The `@for` block requires `track` — missing `track` is a compiler error, not a warning, which surprises beginners.

**`input()` vs `@Input()`**  
`input()` returns a `Signal<T>` — reading the value requires calling it as a function (`item()`). Students must understand signals as a prerequisite. Introduce `signal()` / `computed()` **before** showing `input()`.

**`output()` vs `@Output() + EventEmitter`**  
`output()` has an identical `.emit()` API — this is the smoothest migration for students. The key difference is no `EventEmitter` import. Students familiar with `EventEmitter` should migrate easily.

**Constructor DI → `inject()`**  
Constructor injection still compiles in Angular 21. The `inject()` function is preferred and is the only option in functional guards/resolvers. Teach `inject()` from the start; mention constructor injection as legacy context only.

**Zoneless change detection**  
`provideZonelessChangeDetection()` means Angular no longer patches browser APIs. Without signals, async side effects will not trigger re-rendering. Must be taught as a concept before introducing async patterns. `ChangeDetectionStrategy.OnPush` is required on all components when zoneless — make it a code standard from Lesson 1.

**Karma → Vitest**  
`ng test` no longer launches a Chrome Karma window. Students expecting browser-based test output will instead see terminal output. No conceptual change to `TestBed` — purely tooling.

**`app.config.ts` present but currently unused**  
The current repo has `app.config.ts` but `main.ts` uses `bootstrapModule`. This inconsistency will confuse students. Fix as Step 2 — after which `app.config.ts` becomes the authoritative provider list.

**What can stay identical:** Template syntax (property binding `[prop]`, event binding `(event)`, interpolation `{{}}`, two-way `[(ngModel)]`), `@angular/forms` Reactive/Template-driven APIs, `@angular/router` `RouterLink` / `RouterOutlet`, `HttpClient` injectable. These are safe to teach without caveats.

---

## 8. Open questions for instructor

1. **`@ng-bootstrap/ng-bootstrap` v17 targets Angular 18.** Angular 21 compatibility is unconfirmed. Decision required: (a) upgrade to ng-bootstrap v18/v19 if released, (b) replace with Angular Material CDK components, or (c) remove ng-bootstrap from part-1 scope entirely — it does not appear to be used in any scanned template (only `NgbModule` is imported in `AppModule` but no `<ngb-*>` tags found).

2. **`app.config.ts` exists but `main.ts` bootstraps via `AppModule`.** This is a contradiction likely left from project generation. Students running the current code get NgModule behavior, not `app.config.ts` providers. Should this be corrected as a pre-training fix before students clone the repo?

3. **`app.component.ts` imports `RouterOutlet` but has no `imports` array and no `<router-outlet>` in template.** Routes array is empty. Is routing intended to be introduced in part-1, or should `RouterOutlet` and `app.routes.ts` be removed entirely from this branch to reduce cognitive load for beginners?

4. **`item.ts` model includes `imageUrl?: string` but it is unused in all templates.** Is `NgOptimizedImage` intended to be demonstrated in part-1? If yes, sample image assets and image loader provider setup are required.

5. **All spec files use `imports: [ComponentName]` (standalone test pattern) but components are not standalone.** Tests will fail on the current branch. Should failing tests be fixed before the student-facing commit, or is the test inconsistency intentionally left for a testing lesson?

6. **Zoneless adoption in part-1:** `provideZonelessChangeDetection()` is the Angular 21 default recommendation but requires `OnPush` on all components. For absolute beginners in part-1, should the training use Zone.js + `OnPush` as an intermediate step, or go directly to zoneless?

7. **`src/assets/data.settings.json` contents not verified.** Confirm no credentials, API keys, or environment-specific values are stored in static assets (should be in `src/environments/` or server-side config).

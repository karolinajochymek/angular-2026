# Audit Report: wew-21-cz01-25@part-2

> Generated: 2026-04-28 | Auditor: GitHub Copilot (Angular 21 migration instruction)

## 1. Repository snapshot

| Field | Value |
|---|---|
| Repo URL | https://github.com/karolinajochymek/wew-21-cz01-25 |
| Branch | part-2 |
| Commit SHA analyzed | abcaebee3558fa82ea00596ecd6f887f15c5d047 |
| Total files (.ts/.html/.scss) | 57 |
| Components count | 8 (AppComponent, MainPageComponent, ItemsListComponent, ItemComponent, ItemDetailsComponent, ParentComponent, ChildComponent + 1 future placeholder) |
| Services count | 1 (DataService) |
| Directives count | 3 (ColorChangeDirective, CheckPermissionDirective, SimpleCheckPermissionDirective) |
| Pipes count | 4 (LowPricePipe, FullStockPipe, UpperCaseByLastIndxPipe, TextGeneratorPipe) |
| Modules count | 4 (AppModule, ItemModule, SharedModule, LifeCycleHooksModule) |
| Routes count | 4 (`''`, `'items'`, `'items/:id'`, `'life-cycle-hooks-example'`) + `'**'` redirect |

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
| `@analogjs/vitest-angular` | ^1.x |

---

## 3. Architecture inventory

| Path | Type | Standalone? | Uses NgModule? | Uses \*ngIf/\*ngFor? | Uses @Input/@Output? | Uses Observables? | Uses inject()? |
|---|---|---|---|---|---|---|---|
| `src/app/app.component.ts` | Component | No | Yes (AppModule) | No | No | No | No |
| `src/app/main-page/main-page.component.ts` | Component | No | Yes (AppModule) | No | No | No | No |
| `src/app/modules/item/items-list/items-list.component.ts` | Component | No | Yes (ItemModule) | `*ngFor` (html:18) | No | Yes (`Subscription`) | No |
| `src/app/modules/item/items-list/item/item.component.ts` | Component | No | Yes (ItemModule) | `*ngIf` (html:1), `[ngClass]` (html:2) | `@Input`, `@Output` | No | No |
| `src/app/modules/item/item-details/item-details.component.ts` | Component | No | Yes (ItemModule) | `*ngIf` (html:1) | No | Yes (`Subscription` ×2) | No |
| `src/app/modules/life-cycle-hooks/parent/parent.component.ts` | Component | No | Yes (LifeCycleHooksModule) | No (`ngModel` in html) | No | No | No |
| `src/app/modules/life-cycle-hooks/child/child.component.ts` | Component | No | Yes (LifeCycleHooksModule) | No | `@Input` | No | No |
| `src/app/services/data.service.ts` | Service | N/A | No (`providedIn: 'root'`) | No | No | Yes (`Observable`, `HttpClient`) | No |
| `src/app/modules/shared/directives/color-change.directive.ts` | Directive | No | Yes (SharedModule) | No | `@Input` (setter) | No | No |
| `src/app/modules/shared/directives/check-permission.directive.ts` | Directive | No | Yes (SharedModule) | No | `@Input` (setter) ×2 | No | No |
| `src/app/modules/shared/directives/simple-check-permission.directive.ts` | Directive | No | Yes (SharedModule) | No | `@Input` (setter) | No | No |
| `src/app/modules/shared/pipes/low-price.pipe.ts` | Pipe | No | Yes (SharedModule) | No | No | No | No |
| `src/app/modules/shared/pipes/full-stock.pipe.ts` | Pipe | No | Yes (SharedModule) | No | No | No | No |
| `src/app/modules/shared/pipes/upper-case-by-last-indx.pipe.ts` | Pipe | No | Yes (SharedModule) | No | No | No | No |
| `src/app/modules/shared/pipes/text-generator.pipe.ts` | Pipe | No | Yes (SharedModule) | No | No | No | No |
| `src/app/services/guards/item-details.guard.ts` | Guard | N/A (function) | No | No | No | No | No |

**Notes:**
- `angular.json` builder: `@angular-devkit/build-angular:application` — esbuild-based; **not Webpack**. Compatible with Angular 21 migration path.
- `tsconfig.json`: `strict: true` ✓, `experimentalDecorators: true` ✓, `strictStandalone` not present (Angular compiler option — absent means standalone enforcement is off).
- `app.config.ts`: **not present** on this branch. All providers are declared inside `AppModule`.
- `app.routes.ts`: **not present** on this branch. All routes are declared inside `AppModule` (`RouterModule.forRoot`) and feature modules (`RouterModule.forChild`).
- `main.ts`: uses `platformBrowserDynamic().bootstrapModule(AppModule)` — legacy bootstrap.
- `TextGeneratorPipe` is **impure** by behavior (calls `Math.random()` on every change detection cycle) but is not decorated with `pure: false` — this is a hidden performance issue.
- `CheckPermissionDirective` implements `OnChanges` and manipulates `ViewContainerRef` — structural directive pattern; candidate for `@if` with input binding in Angular 21.
- `itemDetailsGuard` is already a functional `CanActivateFn` — this is the Angular 21 pattern. **No migration needed for the guard itself.**
- `DataService` constructor injects `HttpClient` via constructor DI.
- All component spec files use Karma + Jasmine.

---

## 4. Anti-pattern catalog (vs Angular 21)

### A. Module-based architecture

**`src/app/app.module.ts:1–44`** → Entire `@NgModule` with `RouterModule.forRoot`, `ItemModule`, `SharedModule`, `LifeCycleHooksModule`, `BrowserModule`, `BrowserAnimationsModule` → Replace with `bootstrapApplication(AppComponent, appConfig)` in `main.ts`; move `provideRouter(routes)`, `provideHttpClient()`, `provideAnimationsAsync()` to `app.config.ts`:

```typescript
// Angular 21 — app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
```

**`src/main.ts:1–4`** → `platformBrowserDynamic().bootstrapModule(AppModule)` → See snippet above.

**`src/app/modules/item/item.module.ts:1–31`** → `ItemModule` with `RouterModule.forChild` and component declarations → Replace with standalone components; move routes to `app.routes.ts` using `loadComponent`:

```typescript
// Angular 21 — app.routes.ts (items routes, lazy)
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/main-page/main-page.component').then(m => m.MainPageComponent) },
  { path: 'items', loadComponent: () => import('./features/items/items-list/items-list.component').then(m => m.ItemsListComponent) },
  { path: 'items/:id', canActivate: [itemDetailsGuard], loadComponent: () => import('./features/items/item-details/item-details.component').then(m => m.ItemDetailsComponent) },
  { path: 'life-cycle-hooks-example', loadComponent: () => import('./features/life-cycle-hooks/parent/parent.component').then(m => m.ParentComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
```

**`src/app/modules/shared/shared.module.ts:1–34`** → `SharedModule` exporting pipes and directives → Each pipe/directive becomes standalone; consumer components import them directly.

**`src/app/modules/life-cycle-hooks/life-cycle-hooks.module.ts:1–22`** → `LifeCycleHooksModule` with `RouterModule.forChild` → Same pattern as ItemModule above.

---

### B. Legacy control flow

**`src/app/modules/item/items-list/item/item.component.html:1`** → `*ngIf="item && item.no"` → Angular 21 `@if`:

```html
@if (item() && item().no) {
  <div class="row" [class.clicked]="item().isClicked">
    <div class="col">{{item().no}}</div>
    <div class="col">{{item().name | lowPrice:item().price}}</div>
    <div class="col">{{item().price | currency:'USD':'symbol'}}</div>
    <div class="col">{{item().quantity}}</div>
    <a class="col blue" [routerLink]="['/items', item().no]">Details</a>
  </div>
}
```

**`src/app/modules/item/items-list/items-list.component.html:18`** → `*ngFor="let item of filteredItems"` → Angular 21 `@for` with mandatory `track`:

```html
@for (item of filteredItems(); track item.no) {
  <li class="list-group-item">
    <app-item [item]="item" (clickedItem)="onClickedItem($event)" />
  </li>
}
```

**`src/app/modules/item/item-details/item-details.component.html:2`** → `*ngIf="item && item.no"` inside `<ng-container>` → Angular 21 `@if`:

```html
@if (item() && item()?.no) {
  <img class="card-img-top p-4 mt-4" [ngSrc]="item()!.imageUrl!" width="400" height="300" [alt]="item()!.name">
  <div class="card-body">
    <div class="card-title">
      <span class="font-weight-bold">Name: </span>{{item()!.name}}
    </div>
    <div class="d-flex justify-content-between">
      <div><span class="font-weight-bold">Quantity: </span>{{item()!.quantity}}</div>
      <div><span class="font-weight-bold">Price: </span>{{item()!.price | currency:'USD':'symbol'}}</div>
    </div>
  </div>
}
```

**`src/app/modules/life-cycle-hooks/parent/parent.component.html`** → `[(ngModel)]='typedWord'` — `ngModel` is still valid in Angular 21 with `FormsModule` imported directly in the component. No migration required for the syntax itself.

---

### C. Decorator-based I/O

**`src/app/modules/item/items-list/item/item.component.ts:11`** → `@Input() item: Item = {}` → `input<Item>()`:

```typescript
import { input, output } from '@angular/core';
import { Item } from '../../../../models/item';

export class ItemComponent {
  readonly item = input<Item>({});
  readonly clickedItem = output<number>();

  onClick(): void {
    if (this.item()?.no) {
      this.clickedItem.emit(this.item().no!);
    }
  }
}
```

**`src/app/modules/item/items-list/item/item.component.ts:12`** → `@Output() clickedItem = new EventEmitter<number>()` → `output<number>()` (see snippet above).

**`src/app/modules/life-cycle-hooks/child/child.component.ts:11`** → `@Input() word: string = ''` → `input<string>('')`:

```typescript
import { input } from '@angular/core';

export class ChildComponent {
  readonly word = input<string>('');
  // all lifecycle console.log calls remain valid for teaching purposes
}
```

**`src/app/modules/shared/directives/color-change.directive.ts:10`** → `@Input() set appColorChange(color: string)` → `input()` with `effect()` for reactive side effect:

```typescript
import { Directive, ElementRef, HostListener, input, effect, inject } from '@angular/core';

@Directive({ selector: '[appColorChange]' })
export class ColorChangeDirective {
  readonly appColorChange = input<string>('red');
  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      // color is read reactively; no-op needed here (HostListener handles display)
    });
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.color = this.appColorChange() || 'red';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.color = 'black';
  }
}
```

**`src/app/modules/shared/directives/check-permission.directive.ts:14,17`** → `@Input() set appCheckPermission` and `@Input() set appCheckPermissionSecondPermission` — two aliased `@Input` setters controlling `ViewContainerRef`. These are structural directives; consider replacing the entire pattern with `@if ((firstPerm && secondPerm))` at the call site, or migrate inputs to `input()` + `effect()`:

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

**`src/app/modules/shared/directives/simple-check-permission.directive.ts:10`** → `@Input() set appSimpleCheckPermission` → `input()` + `effect()` (same pattern as above):

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

(none found — `itemDetailsGuard` at `src/app/services/guards/item-details.guard.ts:3` is already a `CanActivateFn` functional guard. **This is the Angular 21 pattern — no migration required.**)

---

### E. Constructor DI

**`src/app/services/data.service.ts:28`** → `constructor(private http: HttpClient) { }` → `inject()`:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  // ...
}
```

**`src/app/modules/item/items-list/items-list.component.ts:12`** → `constructor(private registeredService: DataService)` → `inject()`:

```typescript
import { inject } from '@angular/core';
import { DataService } from '../../../services/data.service';

export class ItemsListComponent {
  private readonly registeredService = inject(DataService);
}
```

**`src/app/modules/item/item-details/item-details.component.ts:24–26`** → `constructor(private route: ActivatedRoute, private registeredService: DataService, private router: Router)` → `inject()`:

```typescript
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';

export class ItemDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly registeredService = inject(DataService);
  private readonly router = inject(Router);
}
```

**`src/app/modules/shared/directives/color-change.directive.ts:8`** → `constructor(private el: ElementRef)` → `inject(ElementRef)` (see §C snippet above).

**`src/app/modules/shared/directives/check-permission.directive.ts:12`** → `constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef)` → `inject()` (see §C snippet above).

**`src/app/modules/shared/directives/simple-check-permission.directive.ts:8`** → `constructor(private templateRef, private viewContainer)` → `inject()` (see §C snippet above).

**`src/app/modules/life-cycle-hooks/parent/parent.component.ts:13`** → empty `constructor() {}` → remove; no DI needed.

**`src/app/modules/life-cycle-hooks/child/child.component.ts:13`** → empty `constructor() {}` → remove.

---

### F. Manual subscription management

**`src/app/modules/item/items-list/items-list.component.ts:15–23,32–34`** → Manual `Subscription` + `ngOnInit` subscribe + `ngOnDestroy` unsubscribe pattern:

```typescript
items$: Subscription = new Subscription();
items: Item[] = [];

ngOnInit(): void {
  this.items$ = this.registeredService.getProducts().subscribe(data => {
    this.items = data;
  });
}

ngOnDestroy(): void {
  this.items$.unsubscribe();
}
```

→ Angular 21 equivalent using `toSignal()` (auto-unsubscribes):

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { DataService } from '../../../services/data.service';

export class ItemsListComponent {
  private readonly registeredService = inject(DataService);

  readonly items = toSignal(this.registeredService.getProducts(), { initialValue: [] as Item[] });

  readonly filteredItems = computed(() =>
    this.items().filter(x => x.name?.toLowerCase().includes(this.filter().toLowerCase()))
  );
}
```

**`src/app/modules/item/item-details/item-details.component.ts:19–31`** → Two `Subscription` objects (`item$`, `id$`), manual subscribe in `ngOnInit`, manual unsubscribe in `ngOnDestroy`:

```typescript
item$: Subscription = new Subscription();
id$: Subscription = new Subscription();

ngOnInit(): void {
  this.id = Number(this.route.snapshot.params['id']);
  this.item$ = this.registeredService.getProductDetails(this.id).subscribe(data => this.item = data);
}

ngOnDestroy(): void {
  this.item$?.unsubscribe();
}
```

→ Angular 21 equivalent using `toSignal()` + `input()` for route param or `rxResource()`:

```typescript
import { inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

export class ItemDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly registeredService = inject(DataService);
  private readonly router = inject(Router);

  readonly id = toSignal(
    this.route.params.pipe(map(p => Number(p['id']))),
    { initialValue: 0 }
  );

  readonly item = toSignal(
    this.route.params.pipe(
      map(p => Number(p['id'])),
      switchMap(id => this.registeredService.getProductDetails(id))
    ),
    { initialValue: undefined }
  );
}
```

---

### G. Lifecycle hooks doing reactive work

**`src/app/modules/item/items-list/items-list.component.ts:18–22`** → `ngOnInit` used to trigger HTTP fetch and assign to `items` array — reactive data fetch done imperatively. → Replace with `toSignal()` at field declaration level (see §F snippet). `ngOnInit` and `ngOnDestroy` can be removed entirely.

**`src/app/modules/item/item-details/item-details.component.ts:28–31`** → `ngOnInit` used to read route snapshot param and trigger HTTP fetch → Replace with `toSignal()` on `route.params` observable (see §F snippet). Both `ngOnInit` and `ngOnDestroy` can be removed.

**`src/app/modules/life-cycle-hooks/parent/parent.component.ts:18–49`** → All 8 lifecycle hooks (`ngOnChanges`, `ngOnInit`, `ngDoCheck`, `ngAfterContentInit`, `ngAfterContentChecked`, `ngAfterViewInit`, `ngAfterViewChecked`, `ngOnDestroy`) with console.log calls — these are **intentional teaching material** for the lifecycle hooks lesson. Keep as-is for lesson demonstration; add a side-note that `ngOnChanges` is replaced by `effect()` when `input()` signals are used.

**`src/app/modules/life-cycle-hooks/child/child.component.ts:15–49`** → Same comment — lifecycle hooks are teaching material. Keep for lesson; note that after migrating `@Input() word` to `input<string>('')`, `ngOnChanges` will no longer fire for that input (signal inputs do not trigger `ngOnChanges`). This is a critical teaching point.

**`src/app/main-page/main-page.component.ts:13–15`** → `ngOnInit(): void {}` — empty, no purpose. Remove.

---

### H. Missing performance primitives

**All 8 components** → No `changeDetection: ChangeDetectionStrategy.OnPush` set on any component. Required for correct behavior with `provideZonelessChangeDetection()`.

```typescript
@Component({
  selector: 'app-items-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

**`src/app/modules/item/items-list/items-list.component.html`** → No `@defer` blocks. The `app-item` repeated component is a prime candidate:

```html
@for (item of filteredItems(); track item.no) {
  @defer (on viewport) {
    <li class="list-group-item">
      <app-item [item]="item" (clickedItem)="onClickedItem($event)" />
    </li>
  } @placeholder {
    <li class="list-group-item">Loading…</li>
  }
}
```

**`src/app/modules/item/item-details/item-details.component.html:3`** → `<img [src]="item.imageUrl">` — uses plain `[src]`, not `NgOptimizedImage`. Replace with `ngSrc` when item image is available:

```html
<img [ngSrc]="item()!.imageUrl!" width="400" height="300" [alt]="item()!.name" />
```

---

### I. Security gaps

**`src/app/modules/item/item-details/item-details.component.html:3`** → `[src]="item.imageUrl"` — URL value comes from HTTP response (`data.settings.json`). If the data source is ever user-supplied or external, this could lead to open-redirect or mixed-content issues. Use `NgOptimizedImage` with a configured image loader to enforce origin constraints.

**`src/app/services/data.service.ts:11`** → `private dataUrl = '../assets/data.settings.json'` — relative asset path used as API URL. In production this should be an environment variable (`environment.ts`) — not a hardcoded relative path. Verify `src/environments/environment.ts` is where the URL lives in production.

**No `[innerHTML]` bindings found** in any template — not currently a risk.

**`provideHttpClient(withInterceptorsFromDi())`** in `AppModule` — `withInterceptorsFromDi()` is legacy compatibility for class-based interceptors (DI-based). In Angular 21, use `withInterceptors([...])` with functional interceptors:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';

provideHttpClient(withInterceptors([/* functional interceptors here */]))
```

**No XSRF configuration present.** When the app targets a real backend, add `withXsrfConfiguration()` or `withNoXsrfProtection()` explicitly — leaving it implicit is a security teaching gap:

```typescript
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))
```

**No CSP `<meta>` tag or server config** present in `src/index.html`. Recommend introducing this in the HTTP/security lesson.

---

## 5. Migration plan (ordered)

**Step 1 — Upgrade dependencies to Angular 21**

- **Goal:** Bring all Angular packages, CLI, and tooling to 21.2.x
- **Command:**
```bash
ng update @angular/core@21 @angular/cli@21
ng update @angular/material@21 @angular/cdk@21
```
- **Manual fixes after schematic:** Verify `@ng-bootstrap/ng-bootstrap` compatibility (see §8). Update `typescript` to `~5.8.x` in `package.json`. Remove or update `zone.js` depending on zoneless decision. Remove `@angular/platform-browser-dynamic` after standalone migration.
- **Verification:** `ng build` — expect 0 errors; `ng lint`

---

**Step 2 — Migrate to standalone components**

- **Goal:** Convert all 8 components, 3 directives, 4 pipes to standalone; remove all 4 NgModules; create `app.config.ts` + `app.routes.ts`; wire `main.ts` to `bootstrapApplication`
- **Command:**
```bash
ng generate @angular/core:standalone
```
- **Manual fixes after schematic:** Move `provideRouter(routes)`, `provideHttpClient(withInterceptors([]))`, `provideAnimationsAsync()`, `provideZonelessChangeDetection()` into `app.config.ts`. Move all route definitions to `app.routes.ts` using `loadComponent`. Each component must explicitly import `RouterLink`, `RouterOutlet`, `FormsModule`, `NgOptimizedImage`, pipes, and directives it uses.
- **Verification:** `ng build` + `ng serve`; navigate all 4 routes

---

**Step 3 — Migrate legacy control flow**

- **Goal:** Replace `*ngIf`, `*ngFor`, `[ngClass]` with `@if`, `@for (track)`, `[class]`
- **Command:**
```bash
ng generate @angular/core:control-flow
```
- **Manual fixes after schematic:** Verify `track item.no` on `@for`. Replace `[ngClass]` with `[class.clicked]`. Remove `<ng-container>` wrappers replaced by `@if`. Remove `CommonModule` imports.
- **Verification:** `ng build` + visual navigation test through all routes

---

**Step 4 — Migrate `@Input` to `input()` signals**

- **Goal:** Replace `@Input()` in `ItemComponent`, `ChildComponent`, and all three directives
- **Command:**
```bash
ng generate @angular/core:signal-input-migration
```
- **Manual fixes after schematic:** Update all template and component references from `word` to `word()`, `item` to `item()`. In `ChildComponent`, add note that `ngOnChanges` no longer fires for signal inputs — replace with `effect()` if reactive logging is needed for lesson. Migrate directive `@Input` setters to `input()` + `effect()` (see §C snippets).
- **Verification:** `ng build`; test `items/:id` route and lifecycle hooks demo

---

**Step 5 — Migrate signal queries**

- **Goal:** Migrate any `@ViewChild` / `@ContentChild` usages to `viewChild()` / `contentChild()`
- **Command:**
```bash
ng generate @angular/core:signal-queries-migration
```
- **Manual fixes after schematic:** None expected (no `@ViewChild`/`@ContentChild` found in this branch)
- **Verification:** `ng build`

---

**Step 6 — Migrate `@Output` to `output()`**

- **Goal:** Replace `@Output() clickedItem = new EventEmitter<number>()` in `ItemComponent`
- **Command:**
```bash
ng generate @angular/core:signal-event-migration
```
- **Manual fixes after schematic:** Remove `EventEmitter` import. Confirm `.emit()` call in `onClick()` is unchanged.
- **Verification:** `ng build`; click interaction in items list must still invoke `onClickedItem`

---

**Step 7 — Update routing to `app.routes.ts` with `loadComponent`**

- **Goal:** All routes defined in one `app.routes.ts`; remove `RouterModule.forRoot` and `RouterModule.forChild`; use `loadComponent` for lazy loading
- **Command:** Manual (schematic in step 2 handles the bulk; finalise here)
- **Manual fixes:** Confirm `provideRouter(routes)` in `app.config.ts` references the correct file. Ensure `itemDetailsGuard` is imported correctly (functional guard — already compatible).
- **Verification:** `ng build --configuration production`; verify lazy chunk splitting in build output

---

**Step 8 — Guards/resolvers**

- **Goal:** Confirm `itemDetailsGuard` is compatible as-is (it is); document functional guard pattern for students
- **Command:** N/A — no changes required
- **Manual fixes:** Consider adding `inject(Router)` in the guard for redirect-on-fail instead of returning `false` (better UX):

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const itemDetailsGuard: CanActivateFn = (route) => {
  if (!isNaN(Number(route.params['id']))) {
    return true;
  }
  return inject(Router).createUrlTree(['/items']);
};
```

- **Verification:** Navigate to `/items/abc` — should redirect to `/items`

---

**Step 9 — HTTP modernization**

- **Goal:** Replace manual `Subscription` + `ngOnInit`/`ngOnDestroy` with `toSignal()`; replace `withInterceptorsFromDi()` with `withInterceptors([])`; add `withXsrfConfiguration()` if backend is XSRF-protected; move `dataUrl` to `environment.ts`
- **Command:** Manual
- **Manual fixes:** `ItemsListComponent`: replace `items$` + `ngOnInit` + `ngOnDestroy` with `toSignal(this.registeredService.getProducts(), { initialValue: [] })`. `ItemDetailsComponent`: replace two `Subscription`s + `ngOnInit`/`ngOnDestroy` with `toSignal()` on `route.params` + `switchMap`. Move `private dataUrl` in `DataService` to `environment.ts` and inject via `inject(ENVIRONMENT)` or direct import.
- **Verification:** `ng build`; verify items list and item-details render without console errors

---

**Step 10 — Performance primitives**

- **Goal:** Add `ChangeDetectionStrategy.OnPush` to all components; add `@defer` example on items list; replace `[src]` with `NgOptimizedImage` (`ngSrc`)
- **Command:** Manual
- **Manual fixes:** Add `changeDetection: ChangeDetectionStrategy.OnPush` to all 8 component decorators. Add `@defer (on viewport)` wrapper around `<app-item>` in `items-list.component.html`. In `item-details.component.html`, replace `<img [src]>` with `<img [ngSrc]>` and add `width`/`height`. Import `NgOptimizedImage` in `ItemDetailsComponent`.
- **Verification:** `ng build --configuration production`; Lighthouse performance audit

---

**Step 11 — Replace Karma with Vitest**

- **Goal:** Remove Karma test runner; configure Vitest
- **Command:**
```bash
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
npm install -D vitest @analogjs/vitest-angular
```
- **Manual fixes:** Create `vitest.config.ts`. Update `angular.json` test builder to Vitest schema. Update `tsconfig.spec.json`. Fix `DataService` spec — currently `TestBed.configureTestingModule({})` missing `provideHttpClient()`, will throw.
- **Verification:** `npx vitest run` — all specs pass

---

**Step 12 — Cleanup unused imports**

- **Goal:** Remove `CommonModule`, `BrowserModule`, `BrowserAnimationsModule`, `RouterModule`, `@angular/platform-browser-dynamic`; remove unused `RouterOutlet` from `app.component.ts` if not needed; fix empty `constructor()` calls
- **Command:**
```bash
ng generate @angular/core:cleanup-unused-imports
```
- **Manual fixes:** Remove empty constructors from `ParentComponent` and `ChildComponent`. Remove `items$`/`id$` field declarations and `Subscription` imports after signal migration.
- **Verification:** `ng build`; `ng lint` — 0 warnings

---

**Step 13 — Zoneless change detection**

- **Goal:** Replace `provideZoneChangeDetection({ eventCoalescing: true })` with `provideZonelessChangeDetection()`
- **Command:** Manual edit to `app.config.ts`

```typescript
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([]))
  ]
};
```

- **Manual fixes:** Remove `zone.js` from `angular.json` polyfills. Remove `zone.js` from `package.json`. Verify all components have `ChangeDetectionStrategy.OnPush` (step 10).
- **Verification:** `ng build`; full manual test of all 4 routes and interactive elements (filter, click, back button)

---

## 6. New project skeleton (proposed structure)

```
src/
├── main.ts
│   # bootstrapApplication(AppComponent, appConfig)
│   # Lesson tie-in: Lesson 1 — bootstrap and application startup
│
├── index.html
│   # App shell; <meta http-equiv="Content-Security-Policy"> guidance here
│
└── app/
    ├── app.config.ts
    │   # provideZonelessChangeDetection(), provideRouter(routes),
    │   # provideAnimationsAsync(), provideHttpClient(withInterceptors([...]))
    │   # Lesson tie-in: Lesson 1 — application-level DI providers
    │
    ├── app.routes.ts
    │   # All routes; loadComponent() for lazy feature components
    │   # Lesson tie-in: Lesson 5 — routing; Lesson 6 — guards
    │
    ├── app.component.ts / .html / .scss
    │   # Root standalone component; <router-outlet>
    │   # Lesson tie-in: Lesson 1 — root component
    │
    ├── core/
    │   # Application-wide singletons and routing infrastructure
    │   # Lesson tie-in: Lesson 4 — services & DI; Lesson 6 — guards
    │   ├── services/
    │   │   └── data.service.ts              # providedIn: 'root'; HttpClient via inject()
    │   └── guards/
    │       └── item-details.guard.ts        # CanActivateFn — functional guard
    │
    ├── shared/
    │   # Reusable standalone directives and pipes
    │   # Lesson tie-in: Lesson 3 — custom directives; Lesson 2 — custom pipes
    │   ├── directives/
    │   │   ├── color-change.directive.ts
    │   │   ├── check-permission.directive.ts
    │   │   └── simple-check-permission.directive.ts
    │   ├── pipes/
    │   │   ├── low-price.pipe.ts
    │   │   ├── full-stock.pipe.ts
    │   │   ├── upper-case-by-last-indx.pipe.ts
    │   │   └── text-generator.pipe.ts
    │   └── utils/
    │       └── pseudo-random-generator.ts
    │
    ├── models/
    │   └── item.ts                          # Item interface; no Angular dependency
    │
    └── features/
        ├── main-page/
        │   # Lesson tie-in: Lesson 1 — first component; property binding; routing links
        │   ├── main-page.component.ts
        │   ├── main-page.component.html
        │   └── main-page.component.scss
        │
        ├── items/
        │   # Lesson tie-in: Lesson 2 (pipes), Lesson 3 (directives),
        │   # Lesson 4 (services/HTTP), Lesson 5 (routing), Lesson 6 (guards)
        │   ├── items-list/
        │   │   ├── items-list.component.ts  # toSignal(), computed(), @for with track
        │   │   ├── items-list.component.html
        │   │   └── items-list.component.scss
        │   ├── item/
        │   │   ├── item.component.ts        # input(), output()
        │   │   ├── item.component.html      # @if, [class.clicked], pipes
        │   │   └── item.component.scss
        │   └── item-details/
        │       ├── item-details.component.ts  # toSignal() + route params; NgOptimizedImage
        │       ├── item-details.component.html
        │       └── item-details.component.scss
        │
        └── life-cycle-hooks/
            # Lesson tie-in: Lesson 7 — lifecycle hooks demo
            # Keep all 8 hooks as teaching material;
            # annotate ngOnChanges incompatibility with signal inputs
            ├── parent/
            │   ├── parent.component.ts
            │   ├── parent.component.html
            │   └── parent.component.scss
            └── child/
                ├── child.component.ts
                ├── child.component.html
                └── child.component.scss
```

---

## 7. Breaking changes & teaching implications

**NgModule removal — 4 modules disappear**  
Students see `AppModule`, `ItemModule`, `SharedModule`, `LifeCycleHooksModule` in the current source. In Angular 21, all four are gone. The concept of "feature module" is replaced by "feature folder of standalone components". Students must understand that lazy loading is now controlled by `loadComponent`/`loadChildren` in `app.routes.ts`, not by a module boundary.

**`RouterModule.forRoot` / `RouterModule.forChild` disappear**  
Routes are no longer declared inside modules. All routes live in `app.routes.ts` and are registered through `provideRouter(routes)`. Students who understand module-routing will need to re-learn that route registration is a provider-level concern, not a module-level one.

**`@Input()` + `ngOnChanges` → `input()` + `effect()`**  
The lifecycle hooks lesson (`ChildComponent`) explicitly demonstrates `ngOnChanges` firing when `@Input() word` changes. After migrating to `input<string>('')`, `ngOnChanges` **will no longer fire** for that input. This is the single most important breaking change for the lifecycle hooks lesson. Students must be taught: signal inputs react via `effect()` or `computed()`, not `ngOnChanges`. Plan an explicit before/after comparison slide.

**Manual `Subscription` management → `toSignal()`**  
`ItemsListComponent` and `ItemDetailsComponent` teach subscription/unsubscription as a pattern. In Angular 21, `toSignal()` handles teardown automatically. Students learning fresh should see `toSignal()` as the primary pattern; the manual subscription pattern can be shown as "what the framework used to require" for context.

**`withInterceptorsFromDi()` → `withInterceptors([])`**  
The HTTP lesson currently uses `withInterceptorsFromDi()` (class-based interceptor DI pattern). In Angular 21, HTTP interceptors are plain functions registered with `withInterceptors([myInterceptorFn])`. Class-based interceptors still work via `withInterceptorsFromDi()` transitionally, but students learning fresh should only see the functional pattern.

**`provideZonelessChangeDetection()` + `OnPush`**  
Without Zone.js, `typedWord` in `ParentComponent` will not trigger view updates unless `OnPush` + signal-based inputs are used. For the lifecycle hooks lesson this is significant: students will not see console logs from `ngDoCheck` / `ngAfterViewChecked` firing every keystroke in zoneless mode (these are driven by zone-triggered change detection). Decide whether to keep Zone.js for the lifecycle hooks lesson or introduce zoneless as a lesson topic in itself.

**`TextGeneratorPipe` is effectively impure**  
`TextGeneratorPipe` calls `Math.random()` on every `transform()` invocation. In Angular 18 with Zone.js + default change detection, this fires frequently. In Angular 21 with `OnPush` + zoneless, it fires only when the parent's signals change. The pipe is not decorated `pure: false` — this is functionally correct (no state between calls) but the displayed value will change on every CD cycle, which may confuse students. Document this behavior explicitly.

**What can stay identical:** `@Injectable`, `HttpClient`, `RouterLink`, `RouterOutlet`, template binding syntax (`[prop]`, `(event)`, `{{}}`, `[(ngModel)]` with `FormsModule`), Reactive Forms, `ActivatedRoute` / `Router` injection, `CanActivateFn` guard signature, `Pipe` / `Directive` decorator structure.

**Prerequisite ordering:** Signals (`signal()`, `computed()`, `effect()`) must be taught **before** `input()`, `output()`, `toSignal()`, or `httpResource()` make sense. Lifecycle hooks lesson must explicitly address `ngOnChanges` incompatibility with signal inputs.

---

## 8. Open questions for instructor

1. **`@ng-bootstrap/ng-bootstrap` v17 targets Angular 18.** Angular 21 compatibility unconfirmed. It is imported in `AppModule` but no `<ngb-*>` component tags were found in any scanned template — only `NgbModule` in the module imports list. If ng-bootstrap is not actively used in any lesson template, it can be removed entirely. Confirm whether any ng-bootstrap components are used in unscanned templates or planned exercises.

2. **`ChildComponent.ngOnChanges` is the teaching centrepiece of the lifecycle hooks lesson.** After migrating `@Input() word` to `input<string>('')`, `ngOnChanges` no longer fires. Two options: (a) keep `@Input()` decorator pattern in `ChildComponent` specifically to demonstrate `ngOnChanges`, and add a note "this is the legacy pattern — signal inputs use `effect()` instead"; (b) migrate fully and replace the `ngOnChanges` console.log with an `effect()`. Which approach fits the training narrative?

3. **`TextGeneratorPipe` generates random text on every call and is not marked `pure: false`.** Should this pipe be refactored to use `signal()` internally so output is stable per render cycle, or should the randomness be kept as a teaching exercise for pipe purity?

4. **`provideHttpClient(withInterceptorsFromDi())`** in `AppModule` implies class-based interceptor DI is taught. Is there a class-based interceptor in the training exercises (not found in this branch)? If yes, it must be migrated to a functional interceptor. If no, replace with `withInterceptors([])` directly.

5. **Zoneless adoption for the lifecycle hooks lesson:** `ngDoCheck` and `ngAfterViewChecked` fire on every Zone.js-triggered change detection cycle, making them visible on each keystroke in the current demo. With `provideZonelessChangeDetection()`, these hooks fire much less frequently. Should the lifecycle hooks demo remain Zone.js-based for observability, or demonstrate zoneless behavior explicitly?

6. **`DataService.dataUrl` points to a relative asset path (`'../assets/data.settings.json'`).** This is hardcoded in the service, not in `environment.ts`. Should the URL be moved to the environment file as part of migration, or is the static JSON file a permanent fixture (no real HTTP API planned)?

7. **`DataService.getProductDetails` fetches the full product list and filters client-side.** This is fine for a static JSON demo, but the commented-out line (`// return this.http.get(\`\${this.dataUrl}/\${id}\`)`) implies a real API endpoint was planned. Should `httpResource()` be demonstrated here as the Angular 21 pattern for signal-based HTTP with a loading/error state, as a replacement for the manual `Subscription` pattern?

8. **`item-details.component.ts` has an `ngOnDestroy` implementation without `implements OnDestroy`** — the `ngOnDestroy` method exists but the class only `implements OnInit`. This is a TypeScript interface omission (currently harmless; Angular calls the hook regardless). Fix during cleanup step or leave as a minor teaching point about interface contracts?

---
applyTo: "**/*.ts,**/*.html,**/*.scss,**/*.json,**/*.md"
description: "Execute Angular 18 → Angular 21 migration of WEW-21 training repos based on prior audit reports and confirmed instructor decisions"
---

# Angular 21 Training Migration — Execute Mode

## Context

This is the **second iteration** of the WEW-21 training update. The first iteration (`angular-21-training-update.instructions.md`) produced read-only audit reports for three branches:

- `wew-21-cz01-25@part-1` — Part 1 of training (basics: components, templates, directives, pipes, data binding)
- `wew-21-cz01-25@part-2` — Part 2 of training (services, DI, HTTP, routing, modules, lifecycle)
- `wew-21-zadania-25` — Homework solutions

You are now in **execute mode**: you write actual production-quality Angular 21 code that will be committed to new branches. Audit reports must be in scope as authoritative input — when in doubt about what exists in the source, refer to the audit report for the corresponding branch.

## Target branches (output)

| Source branch | Target branch | Notes |
|---|---|---|
| `wew-21-cz01-25@part-1` | `wew-21-cz01-25@part-1-v2` | Greenfield Angular 21 rewrite based on audit findings |
| `wew-21-cz01-25@part-2` | `wew-21-cz01-25@part-2-v2` | Greenfield Angular 21 rewrite, depends on part-1-v2 baseline |
| `wew-21-zadania-25` | `wew-21-zadania-25@v2` | Solutions repo aligned with new training content |

Do not modify the source branches. Always create the new branch from scratch using the new project skeleton (see §6 of audit reports).

## Confirmed decisions from instructor (HARD constraints)

These are not negotiable. Apply them mechanically; do not reopen them in any commentary.

| Decision area | Confirmed value |
|---|---|
| **Angular version** | 21.2.x (latest stable as of 2026-Q2) |
| **TypeScript** | ~5.8.x |
| **Standalone** | All components/directives/pipes are standalone; `standalone: true` flag **omitted** (it is the default since v19) |
| **Bootstrap** | `bootstrapApplication(AppComponent, appConfig)` in `main.ts`; no `AppModule` |
| **Change detection** | `provideZonelessChangeDetection()` in **all three repos**; `ChangeDetectionStrategy.OnPush` mandatory on every component |
| **Zone.js** | Removed from `package.json` and `angular.json` polyfills |
| **Control flow** | `@if`, `@for` (with mandatory `track`), `@switch` only — never `*ngIf`/`*ngFor`/`*ngSwitch` in any new template |
| **Component I/O** | `input()`, `input.required()`, `output()`, `model()` — never `@Input`/`@Output` decorators |
| **DI** | `inject()` function — never constructor injection |
| **Guards** | Functional guards (`CanActivateFn`, etc.) — never class-based |
| **HTTP interceptors** | `withInterceptors([])` (functional) — never `withInterceptorsFromDi()` |
| **HTTP fetch pattern** | `HttpClient` returning `Observable` + `toSignal()` at the consumer level. **Do NOT use `httpResource()` or `resource()`** — instructor decision: minimize delta vs current training narrative |
| **Async data in components** | `toSignal()` for HTTP / observables — never manual `subscribe()` + `Subscription` + `ngOnDestroy` unsubscribe pattern |
| **CSS framework** | **Angular Material** + Angular CDK; **ng-bootstrap is removed** from all three repos. Bootstrap CSS may remain only as utility classes for layout (grid, spacing) — no `NgbModule` import anywhere |
| **Forms** | Reactive Forms or template-driven `[(ngModel)]` (still valid). **Signal Forms are not used** (experimental in v21) |
| **Testing** | Vitest + `@analogjs/vitest-angular`; remove Karma + Jasmine |
| **Linting** | ESLint configured in **all three repos** including the solutions repo (was previously absent) |
| **HTTP client provider** | `provideHttpClient(withInterceptors([]))` — empty interceptor array OK; document where to add interceptors in security lesson |
| **`NgOptimizedImage`** | Used wherever `imageUrl` field is rendered (currently never rendered in source — start rendering it in v2) |
| **`@defer`** | Used at least once in each branch as a teaching demonstration; `(on viewport)` for items list, `(on idle)` or `(when ...)` for other cases |
| **Lifecycle hooks lesson (part-2)** | `ChildComponent` migrates fully to `input<string>('')`; `ngOnChanges` is removed and replaced with an `effect()` that logs the value change. The lesson narrative explicitly compares "what `ngOnChanges` did" vs "what `effect()` does" — do NOT keep `@Input()` for legacy demonstration |
| **`DataService`** | Stays with `HttpClient.get<Item[]>()` returning `Observable<Item[]>`. Consumers use `toSignal()`. `dataUrl` value stays as relative asset path; flag with TODO comment "TODO: move to environment.ts when real backend is available" — do NOT move to environment in this iteration |
| **HTML solution variants in `wew-21-zadania-25`** (e.g. `*-1-1.html`, `*-1-2.html`, `*-1-3.html`, `*-1-5.html` switched via commented `templateUrl`) | Replaced with **separate component files per solution step**. Naming pattern: `<feature>-solution-<N>-<sub>.component.ts/html/scss`. Each is independently routable for student exploration. See §"Solutions repo restructuring" below |
| **`app.config.ts`** | Created on every branch (was inconsistently present); single source of providers |
| **`app.routes.ts`** | Created on every branch even if `routes` array is empty; provides hook point for future lessons |
| **`strictStandalone`** | Set to `true` in `tsconfig.json` Angular compiler options to enforce standalone-only authoring |
| **Empty constructors / empty `ngOnInit` / orphan `ngOnDestroy` without `implements OnDestroy`** | All removed during migration |
| **Stale spec content** (`'wew21-2023-zadania'` title, `.content span` selector) | All fixed during migration |

## Coverage scope per target branch

| Concern | part-1-v2 | part-2-v2 | zadania-v2 |
|---|---|---|---|
| Standalone migration | ✓ | ✓ | ✓ |
| Signals (`signal`, `computed`, `effect`) | introduced | reinforced | applied |
| `input()`, `output()`, `model()` | ✓ (basic) | ✓ (full) | ✓ (full) |
| New control flow (`@if`, `@for`, `@switch`) | ✓ | ✓ | ✓ |
| `inject()` | ✓ | ✓ | ✓ |
| Routing + `loadComponent` | minimal | full | full (per-solution routes) |
| Functional guards | — | ✓ | — |
| HTTP + `toSignal()` | — | ✓ | — |
| Lifecycle hooks (with signals caveat) | — | ✓ | — |
| Reactive Forms / `ngModel` | `ngModel` only | both | `ngModel` only |
| `OnPush` + zoneless | ✓ | ✓ | ✓ |
| `@defer` demo | optional | ✓ | ✓ |
| `NgOptimizedImage` | optional | ✓ | ✓ |
| Angular Material | minimal | full | full |
| Vitest | ✓ | ✓ | ✓ |

## Migration execution protocol

For each target branch, execute the following stages **in order**, producing the specified output for each. Do not skip stages even if they appear trivial — the output is consumed by the slides/exercises iteration that follows.

### Stage 0 — Pre-flight check

Output a short markdown block before any code generation:

```
## Pre-flight: <branch>
- Source commit: <SHA>
- Audit report consulted: <filename>
- Confirmed scope: <one-sentence summary>
- Files to create: <count>
- Files to modify: <count>
- Files to delete: <count>
```

### Stage 1 — `package.json`

Output a complete new `package.json`. Mark every dependency change with one of:

- `[KEEP]` — version unchanged
- `[BUMP]` — version bumped
- `[ADD]` — new dependency
- `[REMOVE]` — dependency removed (do not include in final JSON; list separately under "removed")

Required versions:

```
@angular/* : ^21.2.0
@angular/cli, @angular/compiler-cli, @angular-devkit/build-angular, @angular/build : ^21.2.0
@angular/material, @angular/cdk : ^21.2.0
typescript : ~5.8.0
rxjs : ~7.8.0
vitest : ^3.0.0
@analogjs/vitest-angular : ^1.20.0
@analogjs/vite-plugin-angular : ^1.20.0
eslint : ^9.0.0
typescript-eslint : ^8.0.0
angular-eslint : ^21.0.0
```

Removed in all three repos:
- `zone.js`
- `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`
- `jasmine-core`, `@types/jasmine`
- `@ng-bootstrap/ng-bootstrap`
- `@angular/platform-browser-dynamic`

### Stage 2 — Configuration files

Output complete file contents (not diffs) for:

- `tsconfig.json` (with `strict: true`, `strictStandalone: true`, no `experimentalDecorators` flag — TS 5+ supports decorators natively)
- `tsconfig.app.json`
- `tsconfig.spec.json` (Vitest-targeted)
- `angular.json` (using `@angular/build:application` builder, no `polyfills: ['zone.js']`)
- `vitest.config.ts`
- `eslint.config.js` (flat config; `angular-eslint` plugin)
- `.gitignore`
- `src/main.ts` (just `bootstrapApplication`)
- `src/index.html` (with `<meta http-equiv="Content-Security-Policy">` placeholder commented out, ready for security lesson)
- `src/app/app.config.ts` (always present; minimal for part-1 and zadania, full for part-2)
- `src/app/app.routes.ts` (always present; empty array OK for part-1)

### Stage 3 — Source code per file

For every source file (`.ts`, `.html`, `.scss`), output in this exact format:

```
### `<path-from-repo-root>`

**Change type:** [CREATE | MODIFY | DELETE | RENAME]
**Source equivalent (if any):** <path on source branch>
**Maps to lesson:** <lesson identifier from skeleton>
**Audit-report references:** <list of audit findings addressed by this file>

\`\`\`<language>
<full file content>
\`\`\`

**Justification:** <2–4 sentences explaining: (1) what design pattern is applied, (2) why it differs from the source, (3) what teaching point it surfaces>
```

Files must appear in this dependency-aware order:

1. Models / interfaces / type-only files
2. Utilities (no Angular dependency)
3. Pipes
4. Directives
5. Services
6. Guards
7. Functional interceptors (if any)
8. Leaf components (no children)
9. Container components
10. Routes file
11. App config
12. Root component
13. `main.ts`
14. Spec files (paired with their components/services)

### Stage 4 — Verification matrix

After all source code is output, append a verification matrix:

| Check | Command | Expected outcome |
|---|---|---|
| Type check passes | `npx tsc --noEmit` | 0 errors |
| Build passes | `ng build` | 0 errors, 0 warnings |
| Production build | `ng build --configuration production` | bundle size report; no `[Critical]` warnings |
| Lint passes | `ng lint` | 0 errors, 0 warnings |
| Tests pass | `npx vitest run` | all green |
| Dev server boots | `ng serve` | localhost:4200 reachable |
| Manual interaction smoke test | (per branch — list specific UI flows) | (per branch) |

For each branch, fill in the manual smoke test rows specifically.

### Stage 5 — Commit plan

Output an ordered commit plan, one logical commit per stage. Format:

```
1. chore(deps): upgrade to Angular 21 + remove Zone.js, Karma, ng-bootstrap
2. feat(config): add app.config.ts and app.routes.ts; remove AppModule
3. refactor(components): convert to standalone with OnPush
4. refactor(templates): migrate to @if/@for/@switch
5. refactor(io): migrate to input()/output()/model()
6. refactor(di): migrate to inject()
7. refactor(http): migrate subscriptions to toSignal()  [part-2 only]
8. refactor(routing): migrate to provideRouter + loadComponent  [part-2 only]
9. feat(perf): add OnPush, @defer, NgOptimizedImage
10. test(vitest): replace Karma with Vitest; fix stale specs
11. style(lint): configure ESLint flat config; fix violations
12. docs(readme): update README with Angular 21 setup instructions
```

For `wew-21-zadania-25@v2`, replace step 7–9 with:
```
7. refactor(structure): split HTML variant files into separate solution components
8. feat(routing): add per-solution routes for student exploration
9. feat(perf): add NgOptimizedImage and @defer demos
```

## Solutions repo restructuring (zadania-v2)

The audit found that `wew-21-zadania-25` switches between solution variants by commenting/uncommenting `templateUrl` lines (e.g. `unoptimalized-items-list.component-1-1.html` vs `-1-2.html` vs `-1-3.html` vs `-1-5.html`). This is replaced with per-solution standalone components.

### Naming convention

```
src/app/features/items/items-list/solutions/
├── solution-1-1-items-list.component.ts   # ItemsListSolution11Component
├── solution-1-1-items-list.component.html
├── solution-1-2-items-list.component.ts   # ItemsListSolution12Component
├── solution-1-2-items-list.component.html
├── solution-1-3-items-list.component.ts   # ItemsListSolution13Component  (introduces @for)
├── solution-1-3-items-list.component.html
└── solution-1-5-items-list.component.ts   # ItemsListSolution15Component  (filter + @for + appColorChange)
    solution-1-5-items-list.component.html
```

If audit found exercise `1.4` is missing, do NOT create a placeholder file — flag in Stage 5 commit plan as a follow-up question for instructor.

### Routing for solutions

Each solution component is reachable via its own route, so students can navigate between them with `routerLink`:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/main-page/main-page.component').then(m => m.MainPageComponent) },
  { path: 'items/solution-1-1', loadComponent: () => import('./features/items/items-list/solutions/solution-1-1-items-list.component').then(m => m.ItemsListSolution11Component) },
  { path: 'items/solution-1-2', loadComponent: () => import('./features/items/items-list/solutions/solution-1-2-items-list.component').then(m => m.ItemsListSolution12Component) },
  // ...
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
```

The main page (`MainPageComponent`) gets a navigation panel listing all solutions with `routerLink` — this becomes a teaching artifact for the routing lesson.

## Style rules for the migration output

- **No prose preamble.** Start directly with `# Migration: <branch>` — match the audit-report header style.
- **No marketing language.** Stick to precise technical statements.
- **Code blocks must be complete and runnable.** Never use `// ...` placeholders inside generated source files. If a method body would be >20 lines and trivial, it is still better to inline it than truncate.
- **Justifications stay short** (2–4 sentences). They are not essays — they are review aids.
- **Map every change back to the audit report.** Each `### file` block must reference at least one audit finding (anti-pattern category, open question, or breaking change). If a file is created without a corresponding audit reference, explain why under "Justification".
- **Keep existing names where possible.** `MainPageComponent` stays `MainPageComponent`. `UnoptimalizedItemsListComponent` stays (typo and all — it's the deliberate teaching name). `DataService` stays.
- **Speakable commit messages.** Use Conventional Commits format. Each commit message is a single sentence, present tense, lowercase verb.
- **Bilingual code comments.** Code comments describing teaching points may be in Polish (matches the slide language); identifiers and string literals stay English.
- **Polish naming for new student-facing labels.** UI text strings that students will see in the browser may be in Polish (consistent with slides). Internal class/method names stay English.

## What NOT to do

- Do not generate slide content, exercise text, or speaker notes — that is iteration #3.
- Do not introduce features not covered by the source training (no `httpResource()`, no `resource()`, no Signal Forms, no Angular Aria components).
- Do not pin the Angular version below 21.2.x. If 21.x has critical bugs reported, flag in Stage 0 for instructor — do NOT downgrade silently.
- Do not migrate from `[(ngModel)]` to Reactive Forms unless the source already used Reactive Forms — `ngModel` is still valid in Angular 21 with `FormsModule` imported.
- Do not introduce new business logic. The migration is structural and idiomatic, not functional. The same items are displayed, the same filter works the same way, the same checkbox toggles the same list.
- Do not reformat code that does not change — preserve the source's whitespace and comment style where the line is not modified.
- Do not generate `data.settings.json` content — it is data, not source code; copy verbatim from the source branch and flag if missing.
- Do not invent imports. If a symbol is referenced, the import must exist; if no import exists, use the canonical Angular 21 package path (e.g., `provideZonelessChangeDetection` from `@angular/core`, not from `@angular/core/zoneless`).
- Do not change folder layout from §6 of the audit report's "New project skeleton" section without justification under Stage 0.

## Trigger phrase

When the instructor writes "Execute migration on `<branch>` based on `<audit-report-filename>`", produce the full Stage 0–5 output for that branch following the schema above.

The instructor will run the migration **once per branch** (three runs total). Do NOT generate all three branches in a single response — wait for the instructor's trigger phrase per branch.

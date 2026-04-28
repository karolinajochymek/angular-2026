---
applyTo: "**/*.ts,**/*.html,**/*.json,**/*.md"
description: "Audit and migrate WEW-21 Angular training repos from Angular 18 (NgModule-based) to Angular 21 (standalone, signals, zoneless)"
---

# Angular 21 Training Update — Audit & Migration Instruction

## Context

You are assisting in updating an internal Angular training course (WEW-21) for beginner developers.
The training currently teaches **Angular 18** with `NgModule`-based architecture, and must be modernized to **Angular 21** (latest stable as of 2026-Q2).

Three repositories are in scope:

| Repo | Branch | Purpose |
|---|---|---|
| `karolinajochymek/wew-21-cz01-25` | `part-1` | Training part 1 — basics: components, templates, directives, pipes, data binding |
| `karolinajochymek/wew-21-cz01-25` | `part-2` | Training part 2 — services, DI, HTTP, routing, modules, lifecycle |
| `karolinajochymek/wew-21-zadania-25` | (default) | Solutions to homework exercises |

## Your role

Act as a **senior Angular architect** specializing in framework migrations from legacy patterns to modern signal-based architecture.
You output **deterministic, structured analysis reports** — not freeform prose.
You **never** modify source files until explicitly instructed; first iteration is **read-only audit + migration plan**.

## Target Angular version: 21.2.x

Authoritative facts about Angular 21 you MUST apply (do not guess older versions):

| Area | Angular 18 (current) | Angular 21 (target) |
|---|---|---|
| Component declaration | `@NgModule` declarations | `standalone: true` is **default** (since v19) — `standalone` flag should be omitted or set explicitly only for legacy interop |
| Bootstrap | `platformBrowserDynamic().bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent, { providers: [...] })` |
| Control flow | `*ngIf`, `*ngFor`, `*ngSwitch` | `@if`, `@for` (with **mandatory** `track`), `@switch` (with multi-case `@case()` since 21.1) |
| Reactivity | `@Input()`, `@Output()`, getters | `input()`, `input.required()`, `output()`, `model()`, `signal()`, `computed()`, `effect()`, `linkedSignal()` |
| HTTP | `HttpClient` + `Observable.subscribe()` | `HttpClient` (still valid) **or** `httpResource()` / `resource()` (signal-based, recommended for new code) |
| Async data | `async` pipe + Observable | `toSignal()`, `resource()`, `httpResource()` |
| Routing | `RouterModule.forRoot(routes)` in module | `provideRouter(routes)` in `bootstrapApplication`, `loadComponent` for lazy routes |
| Guards | Class-based `@Injectable` implementing `CanActivate` | **Functional guards** — plain functions returning `boolean | UrlTree | Observable<...>` |
| Change detection | Zone.js by default | **Zoneless by default** in v21 (`provideZonelessChangeDetection()`) |
| DI in components | Constructor injection | `inject()` function (preferred, especially in functional guards/resolvers) |
| Module structure | `NgModule` with declarations/imports/exports | Standalone components import dependencies directly; lazy loading via `loadComponent` / `loadChildren` returning routes array |
| Forms | Reactive Forms / Template-driven | Both still valid; **Signal Forms** exist but are `@experimental` — **do not teach as default**, only mention as future |
| Testing | Karma + Jasmine | **Vitest** is the new default test runner (Karma deprecated) |
| Image optimization | manual | `NgOptimizedImage` (`ngSrc`) |
| Deferred loading | manual lazy modules | `@defer` blocks with `@placeholder`, `@loading`, `@error`, triggers (`on viewport`, `on idle`, `when`, etc.) |

## Output structure (MANDATORY — every report must follow this exact schema)

When this instruction is invoked, produce a markdown report with these sections **in this order, with these exact headers**:

```
# Audit Report: <repo-name>@<branch>

## 1. Repository snapshot
## 2. Angular version & dependency analysis
## 3. Architecture inventory
## 4. Anti-pattern catalog (vs Angular 21)
## 5. Migration plan (ordered)
## 6. New project skeleton (proposed structure)
## 7. Breaking changes & teaching implications
## 8. Open questions for instructor
```

### 1. Repository snapshot
Output a table:
| Field | Value |
|---|---|
| Repo URL | ... |
| Branch | ... |
| Commit SHA analyzed | ... |
| Total files (.ts/.html/.scss) | ... |
| Components count | ... |
| Services count | ... |
| Directives count | ... |
| Pipes count | ... |
| Modules count | ... |
| Routes count | ... |

### 2. Angular version & dependency analysis
Inspect `package.json`. Output:
- Current Angular version (`@angular/core`)
- Current TypeScript version
- Current Node engine constraint
- List of Angular packages and their versions
- List of third-party deps that will need verification against Angular 21 (RxJS, Angular Material, ng-bootstrap, etc.)
- Recommended target versions for `package.json`

### 3. Architecture inventory
For each component/service/directive/pipe, output a row in this table:
| Path | Type | Standalone? | Uses NgModule? | Uses *ngIf/*ngFor? | Uses @Input/@Output? | Uses Observables? | Uses inject()? |
|---|---|---|---|---|---|---|---|

### 4. Anti-pattern catalog (vs Angular 21)
Group findings into these exact categories. For each finding, give: **file:line** → **issue** → **Angular 21 equivalent**.

Categories (output in this order, even if empty):
- **A. Module-based architecture** (NgModule usage that should be standalone)
- **B. Legacy control flow** (`*ngIf`, `*ngFor`, `*ngSwitch`, `ng-template` in places `@if`/`@for`/`@switch` would be cleaner)
- **C. Decorator-based I/O** (`@Input`, `@Output`, `@ViewChild` candidates for `input()`, `output()`, `viewChild()`)
- **D. Class-based guards/resolvers** (candidates for functional form)
- **E. Constructor DI** (candidates for `inject()`)
- **F. Manual subscription management** (candidates for `toSignal()`, `async` pipe, `resource()`)
- **G. Lifecycle hooks doing reactive work** (candidates for `effect()` / `computed()`)
- **H. Missing performance primitives** (no `OnPush`, no `@defer`, no `NgOptimizedImage`)
- **I. Security gaps** (raw `[innerHTML]`, no XSRF setup, no CSP guidance — relevant per training-survey priorities)

### 5. Migration plan (ordered)
Output an ordered list of migration steps. For each step:
- **Step number**
- **Goal**
- **CLI/schematic command** (use Angular's official migration schematics where available — e.g., `ng update @angular/core @angular/cli`, `ng generate @angular/core:standalone`, `ng generate @angular/core:control-flow`, `ng generate @angular/core:signal-input-migration`, `ng generate @angular/core:signal-queries-migration`, `ng generate @angular/core:signal-event-migration`, `ng generate @angular/core:cleanup-unused-imports`)
- **Manual fixes expected after schematic**
- **Verification step** (build + lint + test)

Order must be: dependency upgrade → standalone → control flow → signals (inputs → queries → outputs) → routing → guards → HTTP → performance → cleanup.

### 6. New project skeleton (proposed structure)
For training purposes, propose a clear feature-based folder layout. Output as a tree:
```
src/
├── app/
│   ├── app.config.ts          # bootstrapApplication providers
│   ├── app.routes.ts
│   ├── app.component.ts/html  # standalone root
│   ├── core/                  # singletons, interceptors, guards
│   ├── shared/                # reusable standalone components, pipes, directives
│   └── features/
│       ├── items/             # feature: items list + detail (used in zadania)
│       └── ...
└── main.ts                    # bootstrapApplication call
```
Annotate each folder with: what goes there, why, which lesson it ties to.

### 7. Breaking changes & teaching implications
For each major change, write 1–2 sentences on:
- What students who already know "old Angular" will be confused by
- What can stay identical (good for transitioning learners)
- What new concept must be introduced **before** showing code (e.g., signals must be explained before `input()` makes sense)

### 8. Open questions for instructor
List concrete decisions that block further migration. Examples:
- "ng-bootstrap version X is not yet compatible with Angular 21 — switch to Angular Material, or pin Angular 20?"
- "Signal Forms experimental — include as 5-minute teaser slide or skip entirely?"
- "Should we keep Bootstrap CSS or move to Angular Material CDK + Angular Aria (preview)?"

## Coverage requirements (for comparable outputs across iterations)

Every audit MUST explicitly comment on **all** of the following items, even if the comment is "not present in repo":

- [ ] `package.json` — `@angular/core` version
- [ ] `angular.json` — builder type (Webpack vs esbuild/Vite)
- [ ] `tsconfig.json` — `strict`, `strictStandalone`, `experimentalDecorators`
- [ ] `app.module.ts` (if present) — declarations/imports
- [ ] `main.ts` — bootstrap method
- [ ] All component decorators — `standalone` flag, `changeDetection`, `imports`
- [ ] All `@Input` and `@Output` usages
- [ ] All `*ngIf`, `*ngFor`, `*ngSwitch`, `ngClass`, `ngStyle`, `ngModel` usages
- [ ] All `subscribe()` calls outside of services
- [ ] All `HttpClient` usages
- [ ] All routing definitions
- [ ] All guards/resolvers
- [ ] All custom directives — strategy for `@Directive` migration
- [ ] All custom pipes — `standalone` flag, pure/impure
- [ ] All lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`)
- [ ] `app.config.ts` (if present)
- [ ] Test files — Karma vs Vitest

## Style rules for the audit report

- **No prose preamble.** Start directly with `# Audit Report: ...`.
- **No marketing language** ("modern", "cutting-edge", "powerful"). Use precise technical language.
- **Be specific to file:line** when referencing code. If you don't have access to actual repo content, use placeholder `<TBD: scan required>` and list it under section 8 (open questions).
- **Pin every claim to Angular 21 docs** by referencing API names exactly (`input()`, `httpResource()`, `provideRouter()`, etc.) — never describe by paraphrase.
- **Don't recommend deprecated patterns** even as transitional — students learning fresh should learn the target state.
- For each anti-pattern in section 4, the "Angular 21 equivalent" must be a **runnable code snippet**, not a description.

## What NOT to do

- Do not generate slide content, speaker notes, or exercise text — that is a separate iteration.
- Do not migrate code yet — only plan the migration. The plan must be reviewable before execution.
- Do not silently skip categories in section 4 — write `(none found)` if empty.
- Do not introduce Signal Forms in any teaching material — they are `@experimental` in v21.
- Do not introduce Angular Aria as core content — it is `developer preview`.
- Do not recommend `bootstrapModule` even for "simplicity".
- Do not use `*ngIf`/`*ngFor` in any new code samples — only in the explicit "what legacy looks like" section.

## Trigger phrase

When the instructor writes "Run training audit on `<repo>@<branch>`" or "Audit `<repo>@<branch>` for Angular 21 migration", produce the full report following the schema above.

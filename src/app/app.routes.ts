import { Routes } from '@angular/router';
import { validItemIdGuard } from './core/guards/valid-item-id.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
// Router wybiera pasującą trasę; ** zostawiamy na końcu jako widok 404.
// loadComponent używa dynamicznego importu, co pozwala ładować kod strony na żądanie.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'items' },
  {
    path: 'items',
    loadComponent: () =>
      import('./features/items/items-list/items-list.component').then((m) => m.ItemsListComponent),
  },
  {
    path: 'items/:id/edit',
    canActivate: [validItemIdGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/items/item-edit/item-edit.component').then((m) => m.ItemEditComponent),
  },
  {
    path: 'items/:id',
    canActivate: [validItemIdGuard],
    loadComponent: () =>
      import('./features/items/item-details/item-details.component').then(
        (m) => m.ItemDetailsComponent,
      ),
  },
  {
    path: 'lifecycle',
    loadComponent: () =>
      import('./features/lifecycle/lifecycle-demo.component').then((m) => m.LifecycleDemoComponent),
  },
  {
    path: 'security',
    loadComponent: () =>
      import('./features/security/security-demo.component').then((m) => m.SecurityDemoComponent),
  },
  {
    path: 'legacy',
    loadComponent: () =>
      import('./features/legacy/legacy-demo.component').then((m) => m.LegacyDemoComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

import { CanDeactivateFn } from '@angular/router';
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}
// canDeactivate pyta bieżący komponent o niezapisany formularz przed zmianą trasy.
// window.confirm to celowo prosta demonstracja. Guard nie zabezpiecza zamknięcia karty przeglądarki.
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  !component.hasUnsavedChanges() ||
  window.confirm('Masz niezapisane zmiany. Czy opuścić formularz?');

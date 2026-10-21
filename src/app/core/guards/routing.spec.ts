import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { unsavedChangesGuard } from './unsaved-changes.guard';
import { validItemIdGuard } from './valid-item-id.guard';

@Component({ template: '<p>Lista</p>' })
class ListStubComponent {}
@Component({ template: '<p>Formularz</p>' })
class EditStubComponent {
  dirty = false;
  hasUnsavedChanges(): boolean {
    return this.dirty;
  }
}
describe('Guards podczas prawdziwej nawigacji routera', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'items', component: ListStubComponent },
          {
            path: 'items/:id/edit',
            component: EditStubComponent,
            canActivate: [validItemIdGuard],
            canDeactivate: [unsavedChangesGuard],
          },
        ]),
      ],
    }),
  );
  afterEach(() => vi.restoreAllMocks());
  it('przekierowuje niepoprawny identyfikator do listy', async () => {
    const harness = await RouterTestingHarness.create();
    for (const id of ['abc', '0', '-1', '1.5']) {
      await harness.navigateByUrl(`/items/${id}/edit`, ListStubComponent);
      expect(TestBed.inject(Router).url).toBe('/items');
    }
  });
  it('pozwala anulować wyjście i opuścić formularz po potwierdzeniu', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/items/1/edit', EditStubComponent);
    component.dirty = true;
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await harness.navigateByUrl('/items');
    expect(TestBed.inject(Router).url).toBe('/items/1/edit');
    confirm.mockReturnValue(true);
    await harness.navigateByUrl('/items', ListStubComponent);
    expect(TestBed.inject(Router).url).toBe('/items');
  });
  it('nie pyta o wyjście z niezmienionego formularza', async () => {
    const harness = await RouterTestingHarness.create('/items/1/edit');
    const confirm = vi.spyOn(window, 'confirm');
    await harness.navigateByUrl('/items', ListStubComponent);
    expect(confirm).not.toHaveBeenCalled();
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LifecycleDemoComponent } from './lifecycle-demo.component';

describe('Cykl życia dziecka', () => {
  afterEach(() => vi.restoreAllMocks());
  it('przekazuje nowy input i niszczy oraz odtwarza dziecko przez @if', async () => {
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(LifecycleDemoComponent);
    await fixture.whenStable();
    const first = fixture.nativeElement.querySelector('app-lifecycle-child');
    fixture.componentInstance.word.set('Nowy tekst');
    await fixture.whenStable();
    expect(first.textContent).toContain('Nowy tekst');
    expect(
      log.mock.calls.some(([message]) =>
        String(message).startsWith('[ngOnChanges]'),
      ),
    ).toBe(true);
    fixture.componentInstance.visible.set(false);
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('app-lifecycle-child'),
    ).toBeNull();
    expect(log).toHaveBeenCalledWith('[ngOnDestroy] komponent usuwany');
    fixture.componentInstance.visible.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('app-lifecycle-child')).not.toBe(
      first,
    );
    expect(
      fixture.nativeElement.querySelector('app-lifecycle-child').textContent,
    ).toContain('Nowy tekst');
  });
});

import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SecurityDemoComponent } from './security-demo.component';

describe('Bezpieczne wyświetlanie przykładowego HTML', () => {
  it('pokazuje interpolację jako tekst, a z HTML usuwa handler zdarzenia', async () => {
    const fixture = TestBed.createComponent(SecurityDemoComponent);
    fixture.componentInstance.content.set(
      '<strong>Witaj!</strong><img onerror="alert(1)">',
    );
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(
      root.querySelector('[data-testid="literal-content"]')?.textContent,
    ).toContain('<strong>Witaj!</strong>');
    expect(root.querySelector('strong')?.textContent).toBe('Witaj!');
    expect(root.querySelector('img')?.hasAttribute('onerror')).toBe(false);
  });
});

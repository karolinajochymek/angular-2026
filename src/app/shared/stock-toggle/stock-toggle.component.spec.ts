import { describe, it, expect } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StockToggleComponent } from './stock-toggle.component';

@Component({
  imports: [StockToggleComponent],
  template: '<app-stock-toggle [(checked)]="available" />',
})
class HostComponent {
  readonly available = signal(false);
}

describe('Przełącznik dostępności Material', () => {
  it('synchronizuje stan rodzica po kliknięciu oraz zmianie sygnału', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[role="switch"]');
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.available()).toBe(true);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    fixture.componentInstance.available.set(false);
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });
});

import { describe, it, expect } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PermissionDirective } from './permission.directive';
@Component({
  imports: [PermissionDirective],
  template: '<p *appPermission="allowed()">Widoczne</p>',
})
class Host {
  readonly allowed = signal(false);
}
describe('PermissionDirective', () => {
  it('tworzy jeden widok i usuwa go po odebraniu widoczności', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('p')).toHaveLength(0);
    fixture.componentInstance.allowed.set(true);
    await fixture.whenStable();
    fixture.componentInstance.allowed.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('p')).toHaveLength(1);
    fixture.componentInstance.allowed.set(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('p')).toHaveLength(0);
  });
});

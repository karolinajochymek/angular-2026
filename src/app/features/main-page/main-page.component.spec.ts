import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { MainPageComponent } from './main-page.component';

describe('Trasa podstaw', () => {
  it('udostępnia licznik i dyrektywę bez uruchamiania listy HTTP', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basics', MainPageComponent);
    expect(harness.routeNativeElement?.querySelector('app-signal-counter')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-permission-demo')).not.toBeNull();
    expect(harness.routeNativeElement?.querySelector('app-items-list')).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize title signal with default value', () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    expect(fixture.componentInstance.title()).toBe('Witamy na szkoleniu');
  });

  it('should append ! to title when changeTitle() is called', () => {
    const fixture = TestBed.createComponent(MainPageComponent);
    fixture.componentInstance.changeTitle();
    expect(fixture.componentInstance.title()).toBe('Witamy na szkoleniu!');
  });
});

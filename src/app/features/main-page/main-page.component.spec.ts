import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let fixture: ComponentFixture<MainPageComponent>;
  let component: MainPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize title signal with default value', () => {
    expect(component.title()).toBe('Witamy na szkoleniu');
  });

  it('should append ! to title when changeTitle() is called', () => {
    component.changeTitle();
    expect(component.title()).toBe('Witamy na szkoleniu!');
  });
});

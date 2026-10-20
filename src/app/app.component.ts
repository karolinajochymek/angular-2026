import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainPageComponent } from './features/main-page/main-page.component';
@Component({
  selector: 'app-root',
  imports: [MainPageComponent],
  template: '<app-main-page />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

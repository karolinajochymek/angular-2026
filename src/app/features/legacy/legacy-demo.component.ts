import { MatCardModule } from '@angular/material/card';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LegacyCounterModule } from './legacy-counter.module';
@Component({
  selector: 'app-legacy-demo',
  imports: [MatCardModule, LegacyCounterModule],
  styleUrl: './legacy-demo.component.scss',
  templateUrl: './legacy-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyDemoComponent {
  readonly count = signal(0);
}

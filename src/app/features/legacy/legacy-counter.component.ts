import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
// standalone: false pozwala deklarować komponent w NgModule.
// Taką organizację zależności można spotkać w projektach legacy.
@Component({
  selector: 'app-legacy-counter',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './legacy-counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyCounterComponent {
  @Input() value = 0;
  @Output() readonly valueChange = new EventEmitter<number>();
}

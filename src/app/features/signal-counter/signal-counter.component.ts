import { Component, signal, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-signal-counter',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './signal-counter.component.html',
})
export class SignalCounterComponent {
  // Każda instancja ma własny stan; effect służy tu wyłącznie do logowania.
  readonly count = signal(0);
  constructor() {
    effect(() => console.info('[demo effect] Licznik:', this.count()));
  }
  increment(): void {
    this.count.update((value) => value + 1);
  }
}

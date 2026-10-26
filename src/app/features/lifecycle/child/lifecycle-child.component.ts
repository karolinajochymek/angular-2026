import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  effect,
  input,
} from '@angular/core';
// Odbiera dane i pokazuje momenty życia własnej instancji.
@Component({
  selector: 'app-lifecycle-child',
  templateUrl: './lifecycle-child.component.html',
})
export class LifecycleChildComponent implements OnChanges, OnInit, OnDestroy {
  // Zmiana input z rodzica uruchomi zarówno odpowiedni hook, jak i zależny effect.
  readonly word = input('');
  constructor() {
    effect(() => console.info('[effect] aktualna wartość', this.word()));
  }
  // Angular uruchamia ten hook także dla signal inputs; nie jest wycofany.
  ngOnChanges(changes: SimpleChanges): void {
    console.info('[ngOnChanges] działa także dla input()', changes);
  }
  ngOnInit(): void {
    console.info(
      '[ngOnInit] inputy już ustawione; własny widok jeszcze nie zainicjalizowany',
    );
  }
  ngOnDestroy(): void {
    console.info('[ngOnDestroy] komponent usuwany');
  }
}

import { Directive, input, signal } from '@angular/core';
// Temat: dyrektywa atrybutowa. host dodaje zachowanie do istniejącej wiersza listy, bez własnego widoku.
// Powiązanie [style.outline] reaguje na signal; zdarzenia myszy i fokusu zmieniają jego stan.
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.outline]': 'active() ? "2px solid " + appHighlight() : null',
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '(focusin)': 'active.set(true)',
    '(focusout)': 'active.set(false)',
  },
})
export class HighlightDirective {
  readonly appHighlight = input('#006db1');
  readonly active = signal(false);
}

import { CurrencyPipe } from '@angular/common';
import { StockLabelPipe } from '../../../shared/pipes/stock-label.pipe';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Item } from '../models/item';
// dziecko wyświetla cały produkt, rodzic zarządza kolekcją.
// Komponent działa na natywnym tr, aby komórki td pozostały bezpośrednimi dziećmi wiersza.
// To nadal @Component z własnym szablonem, nie dyrektywa.
@Component({
  // Wyjątek dla semantycznego wiersza tabeli; pozostałe komponenty używają elementów app-*.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tr[app-item]',
  imports: [MatButtonModule, CurrencyPipe, StockLabelPipe],
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  // input.required oznacza obowiązkowe dane od rodzica: <tr app-item [item]="produkt"></tr>.
  // Odczytujemy sygnał przez item(); nie zmieniamy tutaj obiektu otrzymanego z góry.
  readonly item = input.required<Item>();
  // Zwykły input ma wartość domyślną, więc rodzic może pominąć to powiązanie.
  readonly selected = input(false);
  // Wczesniej: @Input() i @Output() z EventEmitter. Teraz ten sam kontrakt wyrażają input()/output().
  // output<number> opisuje zdarzenie z liczbą jako danymi. emit(id) powiadamia rodzica.
  readonly picked = output<number>();
}

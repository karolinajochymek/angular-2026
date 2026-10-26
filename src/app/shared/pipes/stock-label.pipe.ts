import { Pipe, PipeTransform } from '@angular/core';
// stockLabel przekształca liczbę na opis w {{ quantity | stockLabel }}.
// Pure pipe (domyślny) przelicza wynik przy zmianie argumentu, a nie do obsługi zdarzeń.
@Pipe({ name: 'stockLabel' })
export class StockLabelPipe implements PipeTransform {
  // Drugi parametr ma domyślny próg; w HTML zmienisz go przez quantity | stockLabel:5.
  transform(quantity: number, lowStock = 3): string {
    // Wartość niedodatnia oznacza brak zapasu, także gdy dane wejściowe zawierają liczbę ujemną.
    if (quantity <= 0) return 'Brak w magazynie';
    return quantity <= lowStock ? `Ostatnie sztuki: ${quantity}` : `Dostępne: ${quantity}`;
  }
}

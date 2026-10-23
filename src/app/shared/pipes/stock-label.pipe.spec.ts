import { describe, it, expect } from 'vitest';
import { StockLabelPipe } from './stock-label.pipe';

describe('StockLabelPipe', () => {
  const pipe = new StockLabelPipe();
  // Granica: zero oznacza brak, a nie małą dostępność.
  it('opisuje brak zapasu', () => {
    expect(pipe.transform(0)).toBe('Brak w magazynie');
  });
  // Sprawdzamy obie strony progu; samo sprawdzenie jednej dodatniej wartości nie wystarczy.
  it('rozróżnia próg i wartość powyżej niego', () => {
    expect(pipe.transform(3)).toBe('Ostatnie sztuki: 3');
    expect(pipe.transform(4)).toBe('Dostępne: 4');
  });
  it('uwzględnia próg przekazany jako parametr', () => {
    expect(pipe.transform(4, 5)).toBe('Ostatnie sztuki: 4');
  });
});

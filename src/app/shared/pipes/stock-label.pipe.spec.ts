import { describe, it, expect } from 'vitest';
import { StockLabelPipe } from './stock-label.pipe';
describe('StockLabelPipe', () => {
  it('rozróżnia zero, próg i dostępność', () => {
    const pipe = new StockLabelPipe();
    expect(pipe.transform(0)).toBe('Brak w magazynie');
    expect(pipe.transform(3)).toBe('Ostatnie sztuki: 3');
    expect(pipe.transform(4)).toBe('Dostępne: 4');
    expect(pipe.transform(4, 5)).toBe('Ostatnie sztuki: 4');
  });
});

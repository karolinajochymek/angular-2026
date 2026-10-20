// Interfejs opisuje kształt produktu podczas sprawdzania TypeScript. Nie waliduje JSON w runtime.
// readonly zapobiega przypadkowym przypisaniom w TypeScript; nie zamraża obiektu w JavaScript.
export interface Item {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly category: 'biuro' | 'elektronika';
  readonly createdAt: string;
  readonly imageUrl: string;
}

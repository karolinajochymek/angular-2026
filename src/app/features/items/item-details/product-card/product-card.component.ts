import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Item } from '../../models/item';
import { StockLabelPipe } from '../../../../shared/pipes/stock-label.pipe';

// Karta prezentuje przekazany produkt; pobieranie danych i stany HTTP należą do rodzica.
@Component({
  selector: 'app-product-card',
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    StockLabelPipe,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly item = input.required<Item>();
}

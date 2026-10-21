import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { Item } from '../models/item';
type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; item: Item }
  | { status: 'missing' }
  | { status: 'error' };
@Component({
  selector: 'app-item-details',
  imports: [MatButtonModule, ProductCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-details.component.html',
})
export class ItemDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.catalog.getItem(Number(params.get('id'))).pipe(
          map(
            (item): DetailState =>
              item ? { status: 'ready', item } : { status: 'missing' },
          ),
          startWith<DetailState>({ status: 'loading' }),
          catchError(() => of<DetailState>({ status: 'error' })),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as DetailState },
  );
}

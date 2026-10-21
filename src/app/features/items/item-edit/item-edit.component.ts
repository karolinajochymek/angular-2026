import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CatalogService } from '../../../core/services/catalog.service';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { Item } from '../models/item';
type EditState = { status: 'loading' | 'missing' | 'error' } | { status: 'ready'; item: Item };
@Component({
  selector: 'app-item-edit',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './item-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemEditComponent implements HasUnsavedChanges {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly original = signal<Item | undefined>(undefined);
  readonly status = signal<'loading' | 'ready' | 'missing' | 'error'>('loading');
  readonly saving = signal(false);
  readonly message = signal('');
  // Model formularza opisujemy w TS; formControlName łączy go z HTML.
  // nonNullable utrzymuje typ string/number po reset(). Validators sprawdzają dane wejściowe.
  // Opcjonalnie Copilot: zaproponuj tabelę danych poprawnych i błędnych dla tych walidatorów.
  // Nie zmieniaj walidacji tylko po to, żeby wygenerowany test przeszedł.
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/\S/)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
  });
  constructor() {
    // Parametr id może zmienić się bez odtworzenia komponentu. switchMap pobiera aktualny produkt.
    // takeUntilDestroyed kończy subskrypcję przy opuszczaniu widoku.
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.catalog.getItem(Number(params.get('id'))).pipe(
            map((item): EditState => (item ? { status: 'ready', item } : { status: 'missing' })),
            startWith<EditState>({ status: 'loading' }),
            // Obsługujemy błąd pojedynczego żądania. Kolejna zmiana id nadal może pobrać dane.
            catchError(() => of<EditState>({ status: 'error' })),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (state) => {
          this.status.set(state.status);
          this.message.set('');
          this.original.set(state.status === 'ready' ? state.item : undefined);
          if (state.status === 'ready') {
            const item = state.item;
            this.form.reset({ name: item.name, price: item.price, quantity: item.quantity });
          }
        },
      });
  }
  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
  save(): void {
    // Pokazujemy także błędy pól, których użytkownik nie odwiedził przed próbą zapisu.
    this.form.markAllAsTouched();
    const item = this.original();
    if (this.form.invalid || !item || this.saving()) return;
    this.message.set('');
    this.saving.set(true);
    this.catalog
      .saveItem({ ...item, ...this.form.getRawValue() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        // Po udanym zapisie formularz jest pristine, więc guard nie zgłosi niezapisanych zmian.
        next: (saved) => {
          this.form.markAsPristine();
          this.saving.set(false);
          void this.router.navigate(['/items', saved.id]);
        },
        error: () => {
          this.saving.set(false);
          this.message.set('Nie udało się zapisać. Spróbuj ponownie.');
        },
      });
  }
}

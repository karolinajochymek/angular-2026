import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LegacyCounterComponent } from './legacy-counter.component';
// Komponent standalone:false należy do declarations modułu.
// Moduł importuje Material i eksportuje komponent, aby rodzic standalone mógł go użyć.
@NgModule({
  imports: [MatButtonModule],
  declarations: [LegacyCounterComponent],
  exports: [LegacyCounterComponent],
})
export class LegacyCounterModule {}

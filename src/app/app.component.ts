import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [MatButtonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Powtarzalny element menu ma jeden szablon. Nazwy i kolejność definiują dane.
  // path jest stabilnym kluczem dla track oraz adresem z konfiguracji routingu.
  readonly navigationLinks: readonly { path: string; label: string }[] = [
    { path: '/items', label: 'Produkty' },
    { path: '/lifecycle', label: 'Cykl życia' },
    { path: '/security', label: 'Bezpieczeństwo' },
    { path: '/legacy', label: 'Starszy kod' },
  ];
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionDirective } from '../../shared/directives/permission.directive';
@Component({
  selector: 'app-permission-demo',
  imports: [MatCardModule, MatCheckboxModule, PermissionDirective],
  templateUrl: './permission-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDemoComponent {
  // Stan widoczności należy do demonstracji, nie do strony składającej przykłady.
  readonly canSeeExtra = signal(false);
}

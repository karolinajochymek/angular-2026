import { MatCardModule } from '@angular/material/card';
import { LifecycleChildComponent } from './child/lifecycle-child.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-lifecycle-demo',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    LifecycleChildComponent,
  ],
  styleUrl: './lifecycle-demo.component.scss',
  templateUrl: './lifecycle-demo.component.html',
})
export class LifecycleDemoComponent {
  readonly word = signal('Angular');
  readonly visible = signal(true);
}

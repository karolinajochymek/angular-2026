import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-security-demo',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, FormsModule],
  styleUrl: './security-demo.component.scss',
  templateUrl: './security-demo.component.html',
})
export class SecurityDemoComponent {
  readonly content = signal(
    '<strong>Witaj!</strong> <img src="x" onerror="alert(1)">',
  );
}

import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  standalone: false,
  templateUrl: './app-validation-errors.html'
})
export class ValidationErrorsComponent {
  @Input() control: AbstractControl | null = null;
  @Input() type: 'text' | 'number' | 'email' | 'date' = 'text';
  @Input() label = 'Field';
}

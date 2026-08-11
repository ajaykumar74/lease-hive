import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type ViewFieldValue = string | number | boolean | Date | null | undefined;

@Component({
  selector: 'app-view-field',
  standalone: false, 
  templateUrl: './view-field.component.html',
  styleUrls: ['./view-field.component.scss']
})
export class ViewFieldComponent {
  @Input() label = '';
  @Input() value: ViewFieldValue = null;
  @Input() emptyText = '-';

  @Input() type:
    | 'text'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'currency' = 'text';

  @Input() dateFormat = 'dd-MMM-yyyy';
  @Input() currencyCode = 'USD';

  get hasValue(): boolean {
    return (
      this.value !== null &&
      this.value !== undefined &&
      this.value !== ''
    );
  }

  get dateValue(): string | number | Date | null {
    if (
      typeof this.value === 'string' ||
      typeof this.value === 'number' ||
      this.value instanceof Date
    ) {
      return this.value;
    }

    return null;
  }

  get numericValue(): number | string | null {
    if (
      typeof this.value === 'number' ||
      typeof this.value === 'string'
    ) {
      return this.value;
    }

    return null;
  }

  get booleanValue(): boolean {
    return this.value === true;
  }

  get booleanText(): string {
    return this.booleanValue ? 'Yes' : 'No';
  }

  get displayValue(): string | number {
    if (!this.hasValue) {
      return this.emptyText;
    }

    if (this.value instanceof Date) {
      return this.value.toString();
    }

    return String(this.value);
  }
}
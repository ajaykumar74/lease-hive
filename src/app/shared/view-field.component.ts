import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { deserializeApiDate } from './api-date.util';

type ViewFieldValue = string | number | boolean | Date | null | undefined;

@Component({
  selector: 'app-view-field',
  standalone: false, 
  templateUrl: './view-field.component.html',
  styleUrls: ['./view-field.component.scss']
})
export class ViewFieldComponent {
  constructor(private readonly datePipe: DatePipe) {}

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
    if (this.value instanceof Date) {
      return Number.isNaN(this.value.getTime()) ? null : this.value;
    }

    const parsedDate = deserializeApiDate(this.value);
    if (parsedDate !== undefined) {
      return parsedDate;
    }

    if (typeof this.value === 'number') {
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

    const parsedDate = deserializeApiDate(this.value);
    if (parsedDate === null) {
      return this.emptyText;
    }

    const date = this.dateValue;
    if (date instanceof Date) {
      const format = this.isMidnight(date) ? this.dateFormat : 'dd-MMM-yyyy HH:mm';
      return this.datePipe.transform(date, format) ?? this.emptyText;
    }

    return String(this.value);
  }

  get dateTimeFormat(): string {
    return 'dd-MMM-yyyy HH:mm';
  }

  private isMidnight(date: Date): boolean {
    return date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0 &&
      date.getMilliseconds() === 0;
  }
}

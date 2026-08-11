import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


@Injectable({ providedIn: 'root' })

export class NumberUtility {
  roundToTwo(value: number): number {
    return parseFloat(value.toFixed(2));
  }
}

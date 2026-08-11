import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: false   // keep same style as your DateFormatPipe
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, limit: number = 20): string {
    if (!value) return '';

    const str = value.toString();

    if (str.length <= limit) {
      return str; // no "..." if short
    }

    return str.substring(0, limit) + '...';
  }

}

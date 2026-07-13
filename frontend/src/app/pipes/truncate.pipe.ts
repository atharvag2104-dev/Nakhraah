import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100): string {
    if (!value) return '';
    return value.length <= limit ? value : value.substring(0, limit) + '...';
  }
}

@Pipe({ name: 'currencyInr', standalone: true })
export class CurrencyInrPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { PaginationEvent } from '../paginator/paginator.interface';

@Pipe({
  name: 'pagination',
  standalone: true,
})
export class PaginationPipe implements PipeTransform {
  transform<T>(data: T[], { page, size }: PaginationEvent): T[] {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const startIndex = (page - 1) * size;

    return data.slice(startIndex, startIndex + size);
  }
}

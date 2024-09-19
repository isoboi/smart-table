import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nestedValue',
  standalone: true,
})
export class NestedValuePipe implements PipeTransform {
  transform(obj: { [key: string]: any }, path: string): any {
    if (!obj || !path) return null;

    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }
}

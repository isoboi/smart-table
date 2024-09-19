import { Directive, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sTableBody]',
})
export class TableBodyDirective {
  constructor(private template: TemplateRef<any>) {}
}

import { Component, effect, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { OutsideClickDirective } from '../../directives/outside-click.directive';

@Component({
  selector: 's-multi-select',
  standalone: true,
  imports: [OutsideClickDirective],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent {
  options = input<any[]>([]);
  placeholder = input<string>('Choose options');
  isOpen = signal(false);

  selectedOptions: any[] = [];

  constructor() {
    effect(() => {
      this.selectedOptions = this.options().filter((it) => it.checked);
    });
  }

  onChange = (value: any[]) => {};
  onTouched = () => {};

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  isSelected(option: any): boolean {
    return this.selectedOptions.includes(option);
  }

  toggleSelection(option: any) {
    if (this.isSelected(option)) {
      this.selectedOptions = this.selectedOptions.filter((o) => o !== option);
    } else {
      this.selectedOptions.push(option);
    }
    this.onChange(this.selectedOptions);
    this.onTouched();
  }

  get displaySelectedOptions(): string {
    if (this.selectedOptions.length === 0) {
      return '';
    }

    if (this.selectedOptions.length >= 4) {
      return `${this.selectedOptions.length} options selected`;
    }

    return this.selectedOptions.map((option) => option.label).join(', ');
  }

  writeValue(value: any[]): void {
    if (value) {
      this.selectedOptions = value;
    } else {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

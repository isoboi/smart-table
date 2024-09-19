import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OutsideClickDirective } from '../../directives/outside-click.directive';
import { SelectOptionInterface } from './select.option.interface';

type ValueKey = keyof SelectOptionInterface;

@Component({
  selector: 's-select',
  standalone: true,
  imports: [OutsideClickDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  options = input<SelectOptionInterface[]>([]);
  placeholder = input<string>('Choose option');
  valueKey = input<ValueKey>('value');
  selectedOption = signal<any>(null);
  isOpen = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(obj: any): void {
    this.selectedOption.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  selectOption(option: SelectOptionInterface): void {
    this.onChange(option[this.valueKey()]);
    this.selectedOption.set(option);
    this.toggleDropdown();
  }
}

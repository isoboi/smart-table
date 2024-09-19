import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appOutsideClick]',
})
export class OutsideClickDirective {
  private elementRef: ElementRef;

  public outsideClick = output<void>();

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(targetElement: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      this.outsideClick.emit();
    }
  }
}

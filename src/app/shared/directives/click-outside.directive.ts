import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';


/**
 * Detect click outside an component mark with the directive appClickOutside.
 *
 * <component clickOutside (onClickOutside)=""></component>
 */
@Directive({
  standalone: true,
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  private elementRef: ElementRef = inject(ElementRef);

  @Output() onClickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside)
      this.onClickOutside.emit();
  }
}

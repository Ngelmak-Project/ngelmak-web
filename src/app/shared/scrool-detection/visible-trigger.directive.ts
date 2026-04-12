import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  OnDestroy,
  output,
  signal
} from '@angular/core';

@Directive({
  selector: '[appVisibleTrigger]',
  standalone: true,
})
export class VisibleTriggerDirective implements AfterViewInit, OnDestroy {
  visible = output<void>();

  private observer!: IntersectionObserver;
  private isVisible = signal(false);

  constructor(private el: ElementRef) {
    effect(() => {
      if (this.isVisible()) {
        this.visible.emit();
      }
    });
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isVisible.set(entry.isIntersecting);
      },
      {
        root: null, // ← window or nearest scroll container
        threshold: 0.1,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  inject,
  signal,
  effect,
} from '@angular/core';

@Directive({
  selector: '[scrollEndDetection]',
  standalone: true,
})
export class ScrollEndDetectionDirective implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef);
  private observer!: IntersectionObserver;

  @Input() rootSelector: string | null = null;
  @Input() debounce = 300;

  @Output() scrollEndDetection = new EventEmitter<void>();

  private triggerSignal = signal(false);

  constructor() {
    // Debounced effect
    effect(() => {
      if (this.triggerSignal()) {
        setTimeout(() => this.scrollEndDetection.emit(), this.debounce);
      }
    });
  }

  ngAfterViewInit() {
    const root = this.rootSelector ? document.querySelector(this.rootSelector) : null;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.triggerSignal.set(true);
        }
      },
      {
        root,
        threshold: 0.1,
      },
    );

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

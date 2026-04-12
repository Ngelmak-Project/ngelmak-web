import { Directive, ElementRef, Input, effect, inject, OnInit } from '@angular/core';
import { TranslationService } from './translation.service';

@Directive({
  selector: '[translate]]',
  standalone: true,
})
export class TranslateDirective implements OnInit {
  private el = inject(ElementRef);
  private i18n = inject(TranslationService);

  private defaultContent = '';

  @Input('translate') key!: string;
  @Input('translateParams') params?: Record<string, any>;

  constructor() {
    effect(() => {
      if (!this.key) return;

      const translated = this.i18n.translate(this.key, this.params);

      if (translated === this.key) {
        this.el.nativeElement.textContent = this.defaultContent;
      } else {
        this.el.nativeElement.textContent = translated;
      }
    });
  }

  ngOnInit() {
    this.defaultContent = this.el.nativeElement.textContent.trim();
  }
}

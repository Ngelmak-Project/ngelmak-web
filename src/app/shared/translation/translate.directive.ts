import { Directive, ElementRef, Input, effect, inject, OnInit } from '@angular/core';
import { TranslationService } from './translation.service';

@Directive({
  selector: '[translate]',
  standalone: true,
})
export class TranslateDirective implements OnInit {
  private el = inject(ElementRef);
  private i18n = inject(TranslationService);

  // Original content of the element (used as fallback when translation is missing).
  private defaultContent = '';

  /*
   * Translation key provided by the user.
   * eg., <div translate="home.title"></div>
   */
  @Input('translate') key!: string;
  /*
   * Optional interpolation parameters.
   * eg., <div [translateParams]="{ name: 'Alex' }"></div>
   */
  @Input('translateParams') params?: Record<string, any>;

  constructor() {
    /*
     * Reactive effect:
     * Runs whenever the translation dictionary or params change.
     * Updates the element's innerHTML with the translated value.
     */
    effect(() => {
      if (!this.key) return;

      // Trigger reactivity on dictionary changes
      const _ = this.i18n.dictionary();
      const translated = this.i18n.translate(this.key, this.params);

      // If translation exists, use it; otherwise restore original content
      this.el.nativeElement.innerHTML = translated !== this.key ? translated : this.defaultContent;
    });
  }

  ngOnInit() {
    /*
     * Stores the element's initial content before translation.
     * This is used as a fallback when a translation key is missing.
     */
    this.defaultContent = this.el.nativeElement.innerHTML.trim();
  }
}

import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // IMPORTANT: makes pipe reactive
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(TranslationService);

  transform(key: string, params?: Record<string, any>): string {
    return this.i18n.translate(key, params);
  }
}

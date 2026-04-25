import { Pipe, PipeTransform, effect, inject, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../translation/translation.service';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';

@Pipe({
  name: 'formatMediumDatetime',
  standalone: true,
  pure: false,
})
export default class FormatMediumDatetimePipe implements PipeTransform {
  private lastValue = '';
  private lastDate: any;
  private lastShort = false;

  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(TranslationService);

  constructor() {
    effect(() => {
      const _dict = this.i18n.dictionary();
      const lang = this.i18n.lang();
      dayjs.locale(lang);
      this.lastValue = this.compute(this.lastDate, this.lastShort);
      this.cdr.markForCheck(); // 👈 FIX: forces UI refresh
    });
  }

  transform(date: any, short = false): string {
    this.lastDate = date;
    this.lastShort = short;
    this.lastValue = this.compute(date, short);
    return this.lastValue;
  }

  private compute(date: any, short: boolean): string {
    if (!date) return '';

    const key = short
      ? 'ngelmakTranslation.shared.date.format.short'
      : 'ngelmakTranslation.shared.date.format.medium';

    const format = this.i18n.translate(key);

    if (format === key) return '';

    return dayjs(date).format(format);
  }
}

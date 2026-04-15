import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation/translation.service';

@Pipe({
  name: 'shortDuration',
  standalone: true,
  pure: false // IMPORTANT: makes pipe reactive
})
export default class ShortDurationPipe implements PipeTransform {

  constructor(private translate: TranslationService) {}

  transform(time: any, short: boolean = false): string {
    const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

    // < 30 seconds → "Just now"
    if (seconds < 29) {
      return short
        ? this.translate.translate('shared.date.duration.short.second') // "s"
        : this.translate.translate('shared.date.duration.justNow');
    }

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const unit in intervals) {
      const counter = Math.floor(seconds / intervals[unit]);

      if (counter > 0) {
        if (short) {
          const shortUnit = this.translate.translate(
            `shared.date.duration.short.${unit}`
          );
          return `${counter}${shortUnit}`;
        }

        const translatedUnit = this.translate.translate(
          `shared.date.duration.units.${unit}`
        );

        if (counter === 1) {
          return this.translate.translate('shared.date.duration.singular', {
            count: counter,
            unit: translatedUnit
          });
        }

        return this.translate.translate('shared.date.duration.plural', {
          count: counter,
          unit: translatedUnit
        });
      }
    }

    return '';
  }
}

import { Pipe, PipeTransform, effect } from '@angular/core';
import { TranslationService } from '../translation/translation.service';

@Pipe({
  name: 'duration',
  standalone: true,
  pure: false, // IMPORTANT: makes pipe reactive
})
export default class DurationPipe implements PipeTransform {
  private lastValue = '';

  constructor(private translate: TranslationService) {
    // Re-run pipe when dictionary updates
    effect(() => {
      this.lastValue = this.compute(this.lastTime);
    });
  }

  private lastTime: any;

  transform(time: any): string {
    this.lastTime = time;
    this.lastValue = this.compute(time);
    return this.lastValue;
  }

  private compute(time: any): string {
    const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

    if (seconds < 29) {
      return this.translate.translate('ngelmakTranslation.shared.date.duration.justNow');
    }

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const unit in intervals) {
      const counter = Math.floor(seconds / intervals[unit]);

      if (counter > 0) {
        const translatedUnit = this.translate.translate(`ngelmakTranslation.shared.date.duration.units.${unit}`);
        if (counter === 1) {
          return this.translate.translate('ngelmakTranslation.shared.date.duration.singular', {
            count: counter,
            unit: translatedUnit,
          });
        }

        return this.translate.translate('ngelmakTranslation.shared.date.duration.plural', {
          count: counter,
          unit: translatedUnit,
        });
      }
    }

    return '';
  }
}

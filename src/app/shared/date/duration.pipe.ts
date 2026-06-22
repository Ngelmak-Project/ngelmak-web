import { ChangeDetectorRef, effect, inject, NgZone, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation/translation.service';

@Pipe({
  name: 'duration',
  standalone: true,
  pure: false,
})
export default class DurationPipe implements PipeTransform {
  private i18n = inject(TranslationService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private lastTime: any;
  private lastValue = '';
  private lastComputeTime = 0;
  private updateInterval: any;

  constructor() {
    // React to language changes
    effect(() => {
      this.i18n.lang(); // Subscribe to language signal
      if (this.lastTime !== undefined) {
        this.lastValue = this.compute(this.lastTime);
        this.cdr.markForCheck();
      }
    });
  }

  transform(time: any): string {
    this.lastTime = time;

    // Only recompute if enough time has passed (e.g., 1 second)
    const now = Date.now();
    if (now - this.lastComputeTime >= 1000) {
      this.lastValue = this.compute(time);
      this.lastComputeTime = now;

      // Schedule next update outside Angular zone to avoid triggering change detection
      this.ngZone.runOutsideAngular(() => {
        if (this.updateInterval) clearTimeout(this.updateInterval);
        this.updateInterval = setTimeout(() => {
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        }, 1000);
      });
    }

    return this.lastValue;
  }

  private compute(time: any): string {
    const seconds = Math.floor((Date.now() - new Date(time).getTime()) / 1000);

    if (seconds < 29) {
      return this.i18n.translate('ngelmakTranslation.shared.date.duration.justNow');
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
        const translatedUnit = this.i18n.translate(
          `ngelmakTranslation.shared.date.duration.units.${unit}`,
        );
        if (counter === 1) {
          return this.i18n.translate('ngelmakTranslation.shared.date.duration.singular', {
            count: counter,
            unit: translatedUnit,
          });
        }

        return this.i18n.translate('ngelmakTranslation.shared.date.duration.plural', {
          count: counter,
          unit: translatedUnit,
        });
      }
    }

    return '';
  }

  ngOnDestroy() {
    if (this.updateInterval) clearTimeout(this.updateInterval);
  }
}

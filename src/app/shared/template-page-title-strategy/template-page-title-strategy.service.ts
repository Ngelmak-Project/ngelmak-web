import { TranslationService } from './../translation/translation.service';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TemplatePageTitleStrategyService extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translationService = inject(TranslationService);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // buildTitle retrieves the 'title' property from the route config
    const titleKey = this.buildTitle(snapshot);

    if (titleKey) {
      const translatedTitle = this.translationService.translate(titleKey) || titleKey;
      console.log(titleKey);
      this.title.setTitle(translatedTitle);
    } else {
      this.title.setTitle('Ngelmak Project');
    }
  }
}

import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TemplatePageTitleStrategyService extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }
  override updateTitle(routerState: RouterStateSnapshot) {
    let title = this.buildTitle(routerState);
    if (title !== undefined) {
      title = `Ngelmak | ${title}`;
    } else {
      title = 'Ngelmak';
    }
    this.title.setTitle(title);
  }
}

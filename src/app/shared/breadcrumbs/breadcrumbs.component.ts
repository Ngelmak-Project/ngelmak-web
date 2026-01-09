import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-breadcrumbs',
  standalone: false,
  template: `
  `,
})
export class BreadcrumbsComponent implements OnInit {
  @Input() crumbs: string[] = [];
  crumbsTranslates: string[] = [];
  // .nationalite.delete.question
  constructor() {}

  ngOnInit() {
    this.crumbs = this.crumbs.map(el => `examenDecDscApp.${el}`);
  }
}

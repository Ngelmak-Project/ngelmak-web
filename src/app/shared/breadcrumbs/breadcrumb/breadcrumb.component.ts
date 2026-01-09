import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-breadcrumb',
  standalone: false,
  template: ` <ng-content></ng-content> `,
  styles: [],
  host: {
    class: 'jhi-breadcrumb body-2 text-white leading-none hover:font-bold no-underline trans-ease-out ltr:mr-2 rtl:ml-2',
  },
})
export class BreadcrumbComponent {}

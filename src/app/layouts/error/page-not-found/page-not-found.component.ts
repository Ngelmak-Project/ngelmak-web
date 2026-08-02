import { transition, trigger, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateDirective } from "app/shared/translation/translate.directive";

@Component({
  standalone: true,
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [RouterModule, TranslateDirective],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PageNotFoundComponent { }

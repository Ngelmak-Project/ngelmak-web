import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateDirective } from "app/shared/translation/translate.directive";

@Component({
  standalone: true,
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [RouterModule, TranslateDirective],
})
export class PageNotFoundComponent { }

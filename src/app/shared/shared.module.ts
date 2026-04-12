import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  HasAnyAuthorityDirective,
  HasNoAuthorityDirective,
} from './directives/has-any-authority.directive';
import { TranslateDirective } from './translation/translate.directive';
import { TranslatePipe } from './translation/translate.pipe';

/**
 * lication wide Module
 */
@NgModule({
  imports: [CommonModule, HasAnyAuthorityDirective, HasNoAuthorityDirective, TranslateDirective, TranslatePipe],
  exports: [CommonModule, HasAnyAuthorityDirective, HasNoAuthorityDirective, TranslateDirective, TranslatePipe],
})
export default class SharedModule {}

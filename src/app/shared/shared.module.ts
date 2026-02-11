import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HasAnyAuthorityDirective, HasNoAuthorityDirective } from './directives/has-any-authority.directive';

/**
 * lication wide Module
 */
@NgModule({
  imports: [CommonModule, HasAnyAuthorityDirective, HasNoAuthorityDirective],
  exports: [CommonModule, HasAnyAuthorityDirective, HasNoAuthorityDirective],
})
export default class SharedModule {}

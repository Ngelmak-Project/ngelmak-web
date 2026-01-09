import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import HasAnyAuthorityDirective from './directives/has-any-authority.directive';

/**
 * Application wide Module
 */
@NgModule({
  imports: [CommonModule, HasAnyAuthorityDirective],
  exports: [CommonModule, HasAnyAuthorityDirective],
})
export default class SharedModule {}

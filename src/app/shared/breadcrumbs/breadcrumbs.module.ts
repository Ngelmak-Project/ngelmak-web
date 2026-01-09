import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}

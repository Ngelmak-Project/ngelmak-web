import { Directive, Host, HostListener, Input, contentChild, effect } from '@angular/core';
import { SortDirective } from './sort.directive';

@Directive({
  standalone: true,
  selector: '[ngelmakSortBy]',
})
export class SortByDirective {
  @Input() ngelmakSortBy!: string;

  // iconComponent = contentChild(FaIconComponent);

  // protected sortIcon = faSort;
  // protected sortAscIcon = faSortUp;
  // protected sortDescIcon = faSortDown;

  constructor(@Host() private sort: SortDirective) {
    effect(() => {
      // if (this.iconComponent()) {
      //   let icon: IconDefinition = this.sortIcon;
      //   const { predicate, order } = this.sort.sortState();
      //   if (predicate === this.ngelmakSortBy && order !== undefined) {
      //     icon = order === 'asc' ? this.sortAscIcon : this.sortDescIcon;
      //   }
      //   this.iconComponent()!.icon = icon.iconName;
      //   this.iconComponent()!.render();
      // }
    });
  }

  @HostListener('click')
  onClick(): void {
    // if (this.iconComponent()) {
    //   this.sort.sort(this.ngelmakSortBy);
    // }
  }
}

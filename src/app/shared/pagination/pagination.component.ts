import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IPage } from "./pagination.model";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pagination.component.html",
})
export class PaginationComponent<T> {
  @Input() page: IPage<T>;
  @Output() gotopage = new EventEmitter<number>();

  sequence(
    pageNumber: number,
    totalPages: number,
    size: number = 7
  ): { name: string; value: number }[] {
    const seq = [{ name: "1", value: 1 }];
    if (pageNumber <= 3) {
      seq.push({ name: "2", value: 2 });
      seq.push({ name: "3", value: 3 });
      seq.push({ name: "...", value: Math.floor(totalPages / 2) });
    } else if (pageNumber < totalPages - 3) {
      seq.push({ name: "...", value: Math.floor(totalPages / 4) });
      seq.push({ name: `${pageNumber - 1}`, value: pageNumber });
      seq.push({ name: `${pageNumber}`, value: pageNumber });
      seq.push({ name: `${pageNumber + 1}`, value: pageNumber });
      seq.push({ name: "...", value: Math.floor((3 * size) / 4) });
    } else {
      seq.push({ name: "...", value: Math.floor(totalPages / 2) });
      seq.push({ name: `${pageNumber - 2}`, value: pageNumber - 2 });
      seq.push({ name: `${pageNumber - 1}`, value: pageNumber - 1 });
    }
    seq.push({ name: `${totalPages}`, value: totalPages });
    return seq;
  }
}

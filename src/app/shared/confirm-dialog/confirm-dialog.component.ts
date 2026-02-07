import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInUp400ms } from '../animations/fade-in-up.animation';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  animations: [fadeInUp400ms],
  imports: [ClickOutsideDirective],
})
export class ConfirmDialogComponent {
  @Input() message = 'Are you sure?';
  @Output() confirm = new EventEmitter<boolean>();

  close(result: boolean) {
    this.confirm.emit(result);
  }
}

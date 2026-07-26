import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { fadeInUp400ms } from '../animations/fade-in-up.animation';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import SharedModule from '../shared.module';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [CommonModule, SharedModule, ClickOutsideDirective],
  animations: [fadeInUp400ms],
})
export class ConfirmDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  variant = input<'danger' | 'warning' | 'info' | 'success' | 'default'>('default');

  confirm = output<boolean>();

  close(result: boolean) {
    this.confirm.emit(result);
  }

  // Style presets for each variant
  variantStyles = {
    default: {
      color: 'text-gray-700',
      border: 'border-gray-300',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 border-blue-700',
    },
    danger: {
      color: 'text-red-700',
      border: 'border-red-300',
      confirmBtn: 'bg-red-600 hover:bg-red-700 border-red-700',
    },
    warning: {
      color: 'text-yellow-700',
      border: 'border-yellow-300',
      confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black',
    },
    info: {
      color: 'text-blue-700',
      border: 'border-blue-300',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 border-blue-700',
    },
    success: {
      color: 'text-green-700',
      border: 'border-green-300',
      confirmBtn: 'bg-green-600 hover:bg-green-700 border-green-700',
    },
  };

  style() {
    return this.variantStyles[this.variant()];
  }
}

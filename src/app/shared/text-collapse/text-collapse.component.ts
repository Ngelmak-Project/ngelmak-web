import { Component, input, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import SharedModule from '../shared.module';

@Component({
  standalone: true,
  selector: 'app-text-collapse',
  templateUrl: './text-collapse.component.html',
  imports: [CommonModule, SharedModule],
})
export class TextCollapseComponent implements AfterViewInit {
  @ViewChild('contentDiv') contentDiv!: ElementRef;

  text = input<string>('');
  isExpanded = signal(false);
  shouldShowButton = signal(false);

  maxHeight = 0;
  clampedHeight = 240; // 6 lines approximate height

  ngAfterViewInit() {
    setTimeout(() => {
      const element = this.contentDiv.nativeElement;
      this.maxHeight = element.scrollHeight;
      this.shouldShowButton.set(this.maxHeight > this.clampedHeight);
    }, 0);
  }

  toggleExpand() {
    this.isExpanded.update((v) => !v);
  }
}

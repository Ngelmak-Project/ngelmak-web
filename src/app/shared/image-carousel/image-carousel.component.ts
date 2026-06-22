import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { fadeInRight400ms } from '../animations/fade-in-right.animation';
import { fadeInUp400ms } from '../animations/fade-in-up.animation';


@Component({
  standalone: true,
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  imports: [CommonModule],
  animations: [fadeInRight400ms, fadeInUp400ms],
})
export class ImageCarouselComponent {
  urls = input.required<string[]>();

  index = signal(0);

  next() {
    if (this.index() < this.urls().length - 1) {
      this.index.update((i) => i + 1);
    }
  }

  prev() {
    if (this.index() > 0) {
      this.index.update((i) => i - 1);
    }
  }

  goTo(position: number) {
    if (position >= 0 && position < this.urls().length) {
      this.index.set(position);
    }
  }
}

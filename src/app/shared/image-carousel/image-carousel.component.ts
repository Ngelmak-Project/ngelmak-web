import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  imports: [CommonModule],
})
export class ImageCarouselComponent {
  urls = input.required<string[]>();

  index = signal(0);
  isLightboxOpen = signal(false);
  lightboxIndex = signal(0);

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

  openLightbox(position: number) {
    this.lightboxIndex.set(position);
    this.isLightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  lightboxNext(event: Event) {
    event.stopPropagation();
    if (this.lightboxIndex() < this.urls().length - 1) {
      this.lightboxIndex.update((i) => i + 1);
    }
  }

  lightboxPrev(event: Event) {
    event.stopPropagation();
    if (this.lightboxIndex() > 0) {
      this.lightboxIndex.update((i) => i - 1);
    }
  }

  lightboxGoTo(position: number, event: Event) {
    event.stopPropagation();
    if (position >= 0 && position < this.urls().length) {
      this.lightboxIndex.set(position);
    }
  }
}

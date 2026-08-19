import { CommonModule } from '@angular/common';
import { Component, HostListener, input, output, signal } from '@angular/core';
import { IFile } from 'app/entities/models/nk-file.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  imports: [CommonModule, SharedModule],
})
export class ImageViewerComponent {
  images = input<IFile[]>([]);
  ondelete = output<number>();

  selectedImage = signal<IFile | null>(null);

  openImage(file: IFile) {
    this.selectedImage.set(file);
  }

  selectImageByFile(file: IFile) {
    this.selectedImage.set(file);
  }

  getCurrentImageIndex(): number {
    const current = this.selectedImage();
    return current ? this.images().findIndex((img) => img.filename === current.filename) : -1;
  }

  previousImage(event: Event) {
    event.stopPropagation();
    const currentIndex = this.getCurrentImageIndex();
    if (currentIndex > 0) {
      this.selectedImage.set(this.images()[currentIndex - 1]);
    }
  }

  nextImage(event: Event) {
    event.stopPropagation();
    const currentIndex = this.getCurrentImageIndex();
    if (currentIndex < this.images().length - 1) {
      this.selectedImage.set(this.images()[currentIndex + 1]);
    }
  }

  onDeleteImage(idx: number) {
    this.ondelete.emit(idx);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.selectedImage.set(null);
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft() {
    if (this.selectedImage()) {
      this.previousImage(new Event('keydown'));
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight() {
    if (this.selectedImage()) {
      this.nextImage(new Event('keydown'));
    }
  }
}

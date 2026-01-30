import { Component, inject } from '@angular/core';
import { ScrollService } from 'app/shared/services/scroll.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  standalone: false,
})
export default class MainComponent {
  scroll = inject(ScrollService);

  private bottomFired = false;

  /**
   * Handles scroll events on the main content container.
   *
   * - Detects when the user reaches the bottom (with a threshold).
   * - Ensures the bottom event fires only once per reach using a lock.
   * - Emits the current scrollHeight so child components can react
   *   when the page grows (e.g., infinite scroll loading more items).
   */
  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;

    const threshold = 50;
    const atBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    // Fire only once per bottom reach
    if (atBottom && !this.bottomFired) {
      this.bottomFired = true;
      // Emit the current scrollHeight so children can react
      this.scroll.emitEnd(scrollHeight);
    }

    // Reset lock when user scrolls up again
    if (!atBottom) {
      this.bottomFired = false;
    }
  }
}

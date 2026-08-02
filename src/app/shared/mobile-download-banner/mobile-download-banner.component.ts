import { Component, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mobile-download-banner',
  imports: [CommonModule],
  templateUrl: './mobile-download-banner.component.html',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MobileDownloadBannerComponent {
  showBanner = signal(true);

  closeBanner() {
    this.showBanner.set(false);
    // Optionally save to localStorage to not show again for 7 days
    localStorage.setItem('bannerClosed', new Date().toISOString());
  }

  ngOnInit() {
    // Check if banner was recently closed
    const closed = localStorage.getItem('bannerClosed');
    if (closed) {
      const closedDate = new Date(closed);
      const daysSince = (Date.now() - closedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        this.showBanner.set(false);
      }
    }
  }
}

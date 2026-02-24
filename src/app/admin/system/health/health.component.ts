import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { Health, HealthDetails, HealthStatus } from './health.model';
import { HealthService } from './health.service';

@Component({
  standalone: true,
  selector: 'app-health',
  templateUrl: './health.component.html',
  imports: [SharedModule],
})
export default class HealthComponent implements OnInit {
  health?: Health;

  private healthService = inject(HealthService);

  ngOnInit(): void {
    this.refresh();
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'bg-success';
    }
    return 'bg-danger';
  }

  refresh(): void {
    this.healthService.checkHealth().subscribe({
      next: health => (this.health = health),
      error: (error: HttpErrorResponse) => {
        if (error.status === 503) {
          this.health = error.error;
        }
      },
    });
  }

  showHealth(health: { key: string; value: HealthDetails }): void {
    // const modalRef = this.modalService.open(HealthModalComponent);
    // modalRef.componentInstance.health = health;
  }
}

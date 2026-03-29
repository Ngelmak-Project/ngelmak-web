import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ActivateService } from './activate.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-activate',
  templateUrl: './activate.component.html',
})
export class ActivateComponent {
  private readonly activateService = inject(ActivateService);
  private readonly route = inject(ActivatedRoute);

  error = signal(false);
  success = signal(false);
  isLoading = signal(false);

  key = this.route.snapshot.queryParamMap.get('key') ?? '';
  keyIsPresent = signal(this.key.length > 0);

  constructor() {
    if (!this.keyIsPresent()) {
      this.error.set(true);
      return;
    }
    this.isLoading.set(true);
    this.activateService
      .get(this.key)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.success.set(true),
        error: () => this.error.set(true),
      });
  }
}

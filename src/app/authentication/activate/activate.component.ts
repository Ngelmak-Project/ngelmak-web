import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { ActivateService } from './activate.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-activate',
  templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
  error = signal(false);
  success = signal(false);

  private readonly activateService = inject(ActivateService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.pipe(mergeMap(params => this.activateService.get(params['key']))).subscribe({
      next: () => this.success.set(true),
      error: (error) => {
        this.error.set(true);
        console.log(error);
      },
    });
  }
}

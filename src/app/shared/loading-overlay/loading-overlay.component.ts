import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingOverlayComponent {
  authReady$ = inject(AuthenticationService).authReady$;
}

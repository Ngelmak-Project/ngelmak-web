import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthenticationService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-loading-overlay',
  imports: [CommonModule],
  template: `@if (!(authReady$ | async)) {
    <div
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-slate-950/95 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label="Chargement"
    >
      <!-- Ambient logo-colored glow -->
      <div class="absolute w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>

      <!-- Spinner composition -->
      <div class="relative w-32 h-32">
        <!-- Outer rotating dashed ring -->
        <div
          class="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 animate-[spin_8s_linear_infinite]"
        ></div>

        <!-- Green and blue outer ring -->
        <div
          class="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-400 border-r-blue-500 shadow-[0_0_18px_rgba(52,211,153,0.65)] animate-spin"
        ></div>

        <!-- Red and blue reverse ring -->
        <div
          class="absolute inset-5 rounded-full border-2 border-transparent border-b-red-500 border-l-blue-400 shadow-[0_0_16px_rgba(239,68,68,0.6)] animate-[spin_1.8s_linear_infinite_reverse]"
        ></div>

        <!-- Inner pulsing core -->
        <div class="absolute flex items-center justify-center inset-9">
          <div class="absolute inset-0 rounded-full bg-emerald-400/20 blur-md animate-pulse"></div>

          <div
            class="relative h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-red-500 shadow-[0_0_24px_rgba(59,130,246,0.85)]"
          >
            <div class="absolute inset-1 rounded-full bg-white/50 blur-[2px]"></div>
          </div>
        </div>

        <!-- Logo-colored particles -->
        <span
          class="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[spin_2.2s_linear_infinite]"
        ></span>

        <span
          class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-[spin_1.5s_linear_infinite_reverse]"
        ></span>

        <span
          class="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-ping"
        ></span>
      </div>

      <!-- Minimal loading text -->
      <div class="relative mt-8 text-center">
        <p
          class="bg-gradient-to-r from-emerald-400 via-blue-400 to-red-500 bg-clip-text text-lg font-bold tracking-[0.35em] text-transparent"
        >
          NGELMAK
        </p>

        <div class="mt-3 flex justify-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"></span>

          <span
            class="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]"
          ></span>

          <span
            class="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:300ms]"
          ></span>
        </div>
      </div>
    </div>
    }`,
})
export class LoadingOverlayComponent {
  authReady$ = inject(AuthenticationService).authReady$;
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <article
      class="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        rounded-none md:rounded-xl lg:rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse"
    >
      <!-- Author -->
      <div class="flex items-center gap-4 mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-br dark:bg-gradient-to-br
             from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800
             rounded-full animate-pulse"
        ></div>

        <div class="space-y-2 flex-1">
          <div
            class="h-4 bg-gradient-to-r dark:bg-gradient-to-r
               from-gray-200 via-gray-200 to-transparent
               dark:from-slate-700 dark:via-slate-700 dark:to-transparent
               rounded-full w-32 animate-pulse"
          ></div>

          <div
            class="h-3 bg-gradient-to-r dark:bg-gradient-to-r
               from-gray-200 via-gray-200 to-transparent
               dark:from-slate-600 dark:via-slate-600 dark:to-transparent
               rounded-full w-20 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-3 mb-6">
        <div class="h-4 bg-gray-300/70 dark:bg-slate-700/70 rounded-md animate-pulse blur-sm"></div>
        <div class="h-4 bg-gray-300/70 dark:bg-slate-700/70 rounded-md animate-pulse blur-sm"></div>
        <div
          class="h-4 bg-gray-300/70 dark:bg-slate-700/70 rounded-md w-5/6 animate-pulse blur-sm"
        ></div>
      </div>

      <!-- Tags -->
      <div class="flex gap-2">
        <div
          class="px-4 py-2 bg-blue-200/50 dark:bg-blue-900/40 rounded-full h-8 animate-pulse"
        ></div>
        <div
          class="px-4 py-2 bg-purple-200/50 dark:bg-purple-900/40 rounded-full h-8 animate-pulse"
        ></div>
        <div
          class="px-4 py-2 bg-pink-200/50 dark:bg-pink-900/40 rounded-full h-8 animate-pulse"
        ></div>
      </div>
    </article>
  `,
})
export class SkeletonComponent {}

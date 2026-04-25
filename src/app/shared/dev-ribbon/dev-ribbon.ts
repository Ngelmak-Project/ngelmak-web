import { CommonModule } from '@angular/common';
import { Component, inject, isDevMode, signal } from '@angular/core';
import SharedModule from '../shared.module';
import { TranslationService } from '../translation/translation.service';

@Component({
  selector: 'app-dev-ribbon',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dev-ribbon.html',
})
export class DevRibbonComponent {
  dev = signal(isDevMode());
  lang = inject(TranslationService).lang;
}

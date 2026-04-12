import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LANGUAGES } from 'app/config/language.constants';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { fadeInOutRight400ms } from 'app/shared/animations/fade-in-out-right.animation';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import SharedModule from 'app/shared/shared.module';
import { TranslationService } from 'app/shared/translation/translation.service';
import { NavbarService } from '../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [fadeInOutRight400ms],
  imports: [RouterModule, ClickOutsideDirective, SharedModule],
})
export class SidebarComponent {
  languages = LANGUAGES;
  private sidebarBehavior = inject(NavbarService);
  private stateStorageService = inject(StateStorageService);

  showNgelmakSubMenu = signal(false);
  showLangKeyOptions = signal(false);

  showSidebar = computed(() => {
    return this.sidebarBehavior.state();
  });

  translateService = inject(TranslationService);

  changeLanguage(lang: 'en' | 'fr'): void {
    this.translateService.setLanguage(lang);
    this.showLangKeyOptions.set(true);
    this.stateStorageService.storeLocale(lang);
    // this.translateService.use(languageKey);
  }

  // Close the sidebar when clicking outside of it.
  closeSidebar(): void {
    this.sidebarBehavior.state.set(false);
  }
}

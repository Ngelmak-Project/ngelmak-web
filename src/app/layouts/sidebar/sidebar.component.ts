import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LANGUAGES } from 'app/config/language.constants';
import { fadeInOutRight400ms } from 'app/shared/animations/fade-in-out-right.animation';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { NavbarService } from '../navbar/navbar.component';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [fadeInOutRight400ms],
  imports: [RouterModule, ClickOutsideDirective],
})
export class SidebarComponent {
  languages = LANGUAGES;
  private sidebarBehavior = inject(NavbarService);
  private stateStorageService = inject(StateStorageService);

  showNgelmakSubMenu = signal(false);
  hideLangKeyOptions = signal(false);

  showSidebar = computed(() => {
    return this.sidebarBehavior.state();
  });

  // Close the sidebar when clicking outside of it.
  closeSidebar(): void {
    this.sidebarBehavior.state.set(false);
  }

  changeLanguage(languageKey: string): void {
    this.hideLangKeyOptions.set(true);
    this.stateStorageService.storeLocale(languageKey);
    // this.translateService.use(languageKey);
  }
}

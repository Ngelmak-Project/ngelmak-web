import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LANGUAGES } from 'app/config/language.constants';
import { fadeInOutRight400ms } from 'app/shared/animations/fade-in-out.animation';
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
  private sidebarBehavior = inject(NavbarService);
  private translateService = inject(TranslationService);

  showNgelmakSubMenu = signal(false);
  showLangKeyOptions = signal(false);
  lang = this.translateService.lang;
  languages = LANGUAGES;

  showSidebar = computed(() => {
    return this.sidebarBehavior.state();
  });

  changeLanguage(lang: string): void {
    this.translateService.setLanguage(lang);
    this.showLangKeyOptions.set(true);
  }

  // Close the sidebar when clicking outside of it.
  closeSidebar(): void {
    this.sidebarBehavior.state.set(false);
  }

  toggleNgelmakMenu(event: Event) {
    event.stopPropagation();
    this.showNgelmakSubMenu.set(!this.showNgelmakSubMenu());
  }
}

import { Component, computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { LANGUAGES } from 'app/config/language.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import SharedModule from 'app/shared/shared.module';
import { TranslationService } from 'app/shared/translation/translation.service';
import { environment } from 'environments/environment.development';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  state = signal<boolean>(false);
}

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, ClickOutsideDirective],
  animations: [fadeInUp400ms],
})
export default class NavbarComponent {
  private sidebarBehavior = inject(NavbarService);
  private signInService = inject(SignInService);
  private translateService = inject(TranslationService);
  private authService = inject(AuthenticationService);

  user = inject(AuthenticationService).authentication;
  activeChannel = inject(ChannelService).channel;
  inProduction?: boolean = environment.production;
  isNavbarCollapsed = signal(true);
  showLangKeyOptions = signal(false);
  lang = this.translateService.lang;
  languages = LANGUAGES;

  isDarkMode = signal(true); // Manage the dark mode state
  showUserSettings = signal(false);
  showNotifications = signal(false);
  isSidebarOpened = computed(() => this.sidebarBehavior.state());

  constructor() {
    effect(() => {
      const userPreference = this.user()?.darkModeEnabled;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // User preference takes priority; fall back to system theme
      const shouldBeDark = userPreference ?? systemPrefersDark;

      if (shouldBeDark) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      } else {
        this.isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
      }
    });
  }

  toggleDarkMode() {
    const isDark = !this.isDarkMode();
    this.isDarkMode.set(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync to backend
    this.authService.updateUser({ darkModeEnabled: isDark });
  }

  toggleSidebar() {
    this.sidebarBehavior.state.set(!this.isSidebarOpened());
  }

  changeLanguage(lang: string): void {
    this.translateService.setLanguage(lang);
    this.showLangKeyOptions.set(false);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  logout(): void {
    this.collapseNavbar();
    this.signInService.signOut();
    inject(Router).navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update((isNavbarCollapsed) => !isNavbarCollapsed);
  }
}

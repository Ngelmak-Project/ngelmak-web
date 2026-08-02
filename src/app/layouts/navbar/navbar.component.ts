import { Component, computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { LANGUAGES } from 'app/config/language.constants';
import { AuthenticationService } from 'app/core/auth/auth.service';
import { StateStorageService } from 'app/core/storage/state-storage.service';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import { UserInitialsPipe } from 'app/shared/pipes/user-initials.pipe';
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
  imports: [RouterModule, SharedModule, ClickOutsideDirective, UserInitialsPipe],
  animations: [fadeInUp400ms],
})
export default class NavbarComponent {
  private sidebarBehavior = inject(NavbarService);
  private signInService = inject(SignInService);
  private translateService = inject(TranslationService);
  private authService = inject(AuthenticationService);
  private routerService = inject(Router);
  private storageService = inject(StateStorageService);

  user = inject(AuthenticationService).authentication;
  activeChannel = inject(ChannelService).channel;
  inProduction?: boolean = environment.production;
  isNavbarCollapsed = signal(true);
  lang = this.translateService.lang;
  languages = LANGUAGES;

  isDarkMode = signal(true); // Manage the dark mode state
  showUserSettings = signal(false);
  showNotifications = signal(false);
  showLanguageSettings = signal(false);
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
    this.initializeTheme();
  }

  async initializeTheme() {
    // 1. Try stored preference
    const stored = await this.storageService.getTheme();

    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      this.applyTheme(stored);
      this.isDarkMode.set(stored === 'dark' || (stored === 'system' && this.systemPrefersDark()));
      return;
    }

    // 2. Check DOM (SSR or hydration)
    if (document.documentElement.classList.contains('dark')) {
      this.isDarkMode.set(true);
      return;
    }

    // 3. System preference fallback
    const prefersDark = this.systemPrefersDark();
    this.isDarkMode.set(prefersDark);
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  private systemPrefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: 'light' | 'dark' | 'system') {
    if (theme === 'system') {
      const prefersDark = this.systemPrefersDark();
      document.documentElement.classList.toggle('dark', prefersDark);
      return;
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  toggleDarkMode() {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);

    const theme = newValue ? 'dark' : 'light';

    // Apply immediately theme
    this.applyTheme(theme);

    // Store preference : fire-and-forget store
    this.storageService.storeTheme(theme);

    // Sync to backend
    this.authService.updateUser({ darkModeEnabled: newValue });
  }

  toggleSidebar() {
    this.sidebarBehavior.state.set(!this.isSidebarOpened());
  }

  changeLanguage(lang: string): void {
    this.translateService
      .setLanguage(lang)
      .catch((error) => console.error('Failed to set language:', error));
    this.showLanguageSettings.set(false);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  logout(): void {
    this.showUserSettings.set(false);
    this.collapseNavbar();
    this.signInService.signOut();
    this.routerService.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update((isNavbarCollapsed) => !isNavbarCollapsed);
  }
}

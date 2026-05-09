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
  private router = inject(Router);
  translateService = inject(TranslationService);
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

  toggleDarkMode() {
    const html = document.documentElement;

    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      this.isDarkMode.set(false);
    } else {
      html.classList.add('dark');
      this.isDarkMode.set(true);
    }
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
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update((isNavbarCollapsed) => !isNavbarCollapsed);
  }
}

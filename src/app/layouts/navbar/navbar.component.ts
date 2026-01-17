import { Component, inject, Injectable, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { LANGUAGES } from 'app/config/language.constants';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { scaleInOut400ms } from 'app/shared/animations/scale-in-out.animation';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';
import SharedModule from 'app/shared/shared.module';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { AuthenticationService } from 'app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private subject = new BehaviorSubject<boolean>(false);
  subject$ = this.subject.asObservable();

  triggerUpdate(value: boolean) {
    this.subject.next(value);
  }
}

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, ClickOutsideDirective],
  animations: [scaleInOut400ms],
})
export default class NavbarComponent implements OnInit {
  private stateStorageService = inject(StateStorageService);
  private sidebarBehavior = inject(NavbarService);
  private signInService = inject(SignInService);
  private router = inject(Router);
  user = inject(AuthenticationService).trackCurrentAuthentication();
  account = inject(AccountService).trackCurrentAccount();
  accountService = inject(AccountService);

  resize$ = fromEvent(window, 'resize');

  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  languages = LANGUAGES;
  openAPIEnabled?: boolean;

  isDarkMode = signal(true); // Manage the dark mode state
  isSidebarOpened = signal(false);
  showAppsDropdown = signal(false);
  showUserSettings = signal(false);

  ngOnInit(): void {
    this.updateSideView(); // Detect the initial size of the window.
    // this.accountService.identity().subscribe(); // update user account from the cache.

    // this.accountService.currentAccount().subscribe(); // get nk-account from the cache.
    this.resize$
      // .pipe(
      //   map((i: any) => i),
      //   debounceTime(500) // He waits > 0.5s between 2 events emitted before running the next.
      // )
      .subscribe(() => this.updateSideView());
  }

  private updateSideView() {
    if (window.innerWidth >= 1024) {
      this.isSidebarOpened.set(true);
    } else {
      this.isSidebarOpened.set(false);
    }
    this.sidebarBehavior.triggerUpdate(this.isSidebarOpened());
  }

  toggleDarkMode() {
    if (!this.isDarkMode()) {
      document.documentElement.classList.remove('light'); // Add .light class to <html>
      document.documentElement.classList.add('dark'); // Add .dark class to <html>
      this.isDarkMode.set(true);
    } else {
      document.documentElement.classList.remove('dark'); // Remove .dark class
      document.documentElement.classList.add('light'); // Add .light class to <html>
      this.isDarkMode.set(false);
    }
  }

  toggleSidebar() {
    this.isSidebarOpened.set(!this.isSidebarOpened());
    this.sidebarBehavior.triggerUpdate(this.isSidebarOpened());
  }

  changeLanguage(languageKey: string): void {
    this.stateStorageService.storeLocale(languageKey);
    // this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.router.navigate(['/sign-in']);
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

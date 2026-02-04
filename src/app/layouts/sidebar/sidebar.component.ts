import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { fadeInOutRight400ms } from 'app/shared/animations/fade-in-out-right.animation';
import { Subscription } from 'rxjs';
import { NavbarService } from '../navbar/navbar.component';
import { ClickOutsideDirective } from "app/shared/directives/click-outside.directive";

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [fadeInOutRight400ms],
  imports: [RouterModule, ClickOutsideDirective],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private sidebarBehavior = inject(NavbarService);

  private subscription: Subscription;
  showSidebar = signal(false);
  showNgelmakSubMenu = signal(false);

  ngOnInit(): void {
    this.subscription = this.sidebarBehavior.subject$.subscribe(state => (this.showSidebar.set(state)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

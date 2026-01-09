import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarService } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
import { fadeInOutRight400ms } from 'app/shared/animations/fade-in-out-right.animation';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [fadeInOutRight400ms],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private sidebarBehavior = inject(NavbarService);

  private subscription: Subscription;
  showSidebar: boolean = true;

  ngOnInit(): void {
    this.subscription = this.sidebarBehavior.subject$.subscribe(state => (this.showSidebar = state));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

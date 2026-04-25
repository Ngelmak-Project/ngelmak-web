import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/alert/alert.component';
import { DevRibbonComponent } from "./shared/dev-ribbon/dev-ribbon";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, DevRibbonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ngelmak-web');
}

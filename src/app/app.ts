import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/alert/alert.component';
import { DevRibbonComponent } from './shared/dev-ribbon/dev-ribbon.component';
import { LoadingOverlayComponent } from './shared/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, DevRibbonComponent, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

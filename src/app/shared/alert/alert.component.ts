import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { scaleInOutAnimation200ms } from "../animations/stagger.animation";
import { fadeInUp400ms } from "../animations/fade-in-up.animation";
import { AlertService } from "./alert.service";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
  animations: [scaleInOutAnimation200ms, fadeInUp400ms],
})
export class AlertComponent {
  alertService = inject(AlertService);
}

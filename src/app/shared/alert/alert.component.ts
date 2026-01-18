import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { scaleInOutAnimation200ms } from "app/shared/animations/stagger.animation";
import { fadeInUp400ms } from "app/shared/animations/fade-in-up.animation";
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
  private alertService = inject(AlertService);
  alerts = computed(() => this.alertService.alerts().slice(-3));

  closeAlert(id: number)
  {
    this.alertService.closeAlert(id);
  }
}

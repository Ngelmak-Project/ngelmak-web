import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { fadeInUp400ms } from "app/shared/animations/fade-in-up.animation";
import { stagger200ms } from "app/shared/animations/stagger.animation";
import { AlertService } from "./alert.service";
import SharedModule from "../shared.module";

@Component({
  selector: "app-alert",
  standalone: true,
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
  imports: [CommonModule, SharedModule],
  animations: [stagger200ms, fadeInUp400ms],
})
export class AlertComponent {
  private alertService = inject(AlertService);
  alerts = computed(() => this.alertService.alerts().slice(-3));

  closeAlert(id: number)
  {
    this.alertService.closeAlert(id);
  }
}

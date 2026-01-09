import { Injectable } from "@angular/core";

export type AlertType = "success" | "error" | "warning" | "info";

export interface IAlert {
  id?: number;
  type: AlertType;
  message?: string;
  translationKey?: string;
  translationParams?: { [key: string]: unknown };
  timeout?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
  autoclose?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AlertService {
  private timeout = 5000;
  private showIcon = true;
  private showCloseButton = true;
  private autoclose = true;
  // unique id for each alert. Starts from 0.
  private alertId = 0;
  private alerts: IAlert[] = [];

  clear(): void {
    this.alerts = [];
  }

  get(): IAlert[] {
    return this.alerts;
  }

  /**
   * Adds alert to alerts array and returns added alert.
   * @param alert      Alert to add. If `timeout`, `toast` or `position` is missing then applying default value.
   *                   If `translateKey` is available then it's translation else `message` is used for showing.
   * @param extAlerts  If missing then adding `alert` to `AlertService` internal array and alerts can be retrieved by `get()`.
   *                   Else adding `alert` to `extAlerts`.
   * @returns  Added alert
   */
  addAlert(alert: IAlert): IAlert {
    alert.id = this.alertId++;

    // if (alert.translationKey) {
    //   const translatedMessage = this.translateService.instant(alert.translationKey, alert.translationParams);
    //   // if translation key exists
    //   if (translatedMessage !== `${translationNotFoundMessage}[${alert.translationKey}]`) {
    //     alert.message = translatedMessage;
    //   } else if (!alert.message) {
    //     alert.message = alert.translationKey;
    //   }
    // }

    alert.message = alert.message ?? "";
    alert.timeout = alert.timeout ?? this.timeout;
    alert.showIcon = alert.showIcon ?? this.showIcon;
    alert.showCloseButton = alert.showCloseButton ?? this.showCloseButton;
    alert.autoclose = alert.autoclose ?? this.autoclose;

    this.alerts.push(alert);

    if (alert.timeout > 0) {
      setTimeout(() => {
        this.closeAlert(alert.id!);
      }, alert.timeout);
    }

    return alert;
  }

  closeAlert(alertId: number): void {
    const alertIndex = this.alerts.map((alert) => alert.id).indexOf(alertId);
    // if found alert then remove
    if (alertIndex >= 0) {
      this.alerts.splice(alertIndex, 1);
    }
  }
}

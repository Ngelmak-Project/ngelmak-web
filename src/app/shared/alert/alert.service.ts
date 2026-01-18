import { Injectable, signal } from "@angular/core";

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
  /* Default timeout for alerts (ms) */
  private readonly defaultTimeout = 5000;

  /* Default UI behavior flags */
  private readonly defaultShowIcon = true;
  private readonly defaultShowCloseButton = true;
  private readonly defaultAutoclose = true;

  /* Internal incremental ID for alerts */
  private alertId = 0;

  /* Reactive list of alerts */
  private readonly _alerts = signal<IAlert[]>([]);

  /* Public readonly signal exposing alerts */
  readonly alerts = this._alerts.asReadonly();

  /**
   * Removes all alerts.
   */
  clear(): void {
    this._alerts.set([]);
  }

  /**
   * Adds a new alert to the list.
   *
   * Automatically assigns:
   * - a unique ID
   * - default timeout
   * - default UI flags
   *
   * Also schedules auto‑close if enabled.
   *
   * @param alert Partial alert definition
   * @returns The fully resolved alert object
   */
  addAlert(alert: IAlert): IAlert {
    const resolved: IAlert = {
      ...alert,
      id: this.alertId++,
      message: alert.message ?? "",
      timeout: alert.timeout ?? this.defaultTimeout,
      showIcon: alert.showIcon ?? this.defaultShowIcon,
      showCloseButton: alert.showCloseButton ?? this.defaultShowCloseButton,
      autoclose: alert.autoclose ?? this.defaultAutoclose,
    };

    // Add alert to the signal list
    this._alerts.update(list => [...list, resolved]);

    // Auto‑close if enabled
    if (resolved.autoclose && resolved.timeout! > 0) {
      setTimeout(() => this.closeAlert(resolved.id!), resolved.timeout);
    }

    return resolved;
  }

  /**
   * Removes an alert by its ID.
   *
   * @param alertId ID of the alert to remove
   */
  closeAlert(alertId: number): void {
    this._alerts.update(list => list.filter(a => a.id !== alertId));
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: Multi-Threshold Alerting & Notification Engine
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { SystemAlert, AlertSeverity } from './observability-types';

export class AlertEngine {
  private activeAlerts: SystemAlert[] = [];

  public triggerAlert(
    severity: AlertSeverity,
    titleArabic: string,
    descriptionArabic: string
  ): Result<SystemAlert, Error> {
    try {
      const alert: SystemAlert = {
        alertId: `alert-${Date.now()}`,
        severity,
        titleArabic,
        descriptionArabic,
        triggeredAtISO: new Date().toISOString(),
        isResolved: false
      };
      this.activeAlerts.push(alert);
      return Result.ok(alert);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getActiveAlerts(): ReadonlyArray<SystemAlert> {
    return this.activeAlerts.filter(a => !a.isResolved);
  }
}

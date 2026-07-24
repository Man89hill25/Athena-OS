/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Academic Notification Center & OS Tray Toast Dispatcher
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { DesktopNotificationItem } from './desktop-types';

export class NotificationCenterEngine {
  private notifications: Map<UUID, DesktopNotificationItem> = new Map();

  public sendNotification(
    titleArabic: string,
    messageArabic: string,
    severity: 'info' | 'warning' | 'error' | 'success' = 'info'
  ): Result<DesktopNotificationItem, Error> {
    try {
      const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const item: DesktopNotificationItem = {
        notificationId,
        titleArabic,
        messageArabic,
        severity,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      this.notifications.set(notificationId, item);
      return Result.ok(item);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getUnreadNotifications(): Result<ReadonlyArray<DesktopNotificationItem>, Error> {
    const unread = Array.from(this.notifications.values()).filter((n) => !n.isRead);
    return Result.ok(unread);
  }
}

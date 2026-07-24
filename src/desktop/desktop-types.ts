/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Desktop Domain Types & Runtime Specifications
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type OperatingSystemTarget = 'windows' | 'linux' | 'macos' | 'web_container';
export type DesktopNetworkMode = 'offline' | 'hybrid' | 'cloud';
export type UIThemeMode = 'dark' | 'light' | 'academic_sepia' | 'contrast';
export type LayoutDirection = 'rtl' | 'ltr';
export type AcademicLanguageLocale = 'ar' | 'en' | 'el' | 'cop' | 'syr' | 'la' | 'he' | 'gez';

export interface DesktopWindowConfig {
  readonly windowId: UUID;
  readonly title: string;
  readonly width: number;
  readonly height: number;
  readonly xPos: number;
  readonly yPos: number;
  readonly isMaximized: boolean;
  readonly isFocused: boolean;
  readonly activeTabId?: UUID;
}

export interface CommandPaletteAction {
  readonly commandId: string;
  readonly labelArabic: string;
  readonly category: 'workspace' | 'library' | 'translation' | 'system' | 'ai';
  readonly shortcutKeys?: string;
  readonly actionFn: () => void;
}

export interface DesktopNotificationItem {
  readonly notificationId: UUID;
  readonly titleArabic: string;
  readonly messageArabic: string;
  readonly severity: 'info' | 'warning' | 'error' | 'success';
  readonly timestamp: ISO8601Timestamp;
  readonly isRead: boolean;
}

export interface AcademicPluginManifest {
  readonly pluginId: string;
  readonly nameArabic: string;
  readonly version: string;
  readonly isEnabled: boolean;
  readonly author: string;
  readonly permissions: ReadonlyArray<string>;
}

export interface DesktopBackupSnapshot {
  readonly snapshotId: UUID;
  readonly timestamp: ISO8601Timestamp;
  readonly sizeInBytes: number;
  readonly checksumMD5: string;
  readonly descriptionArabic: string;
}

export interface DesktopRuntimeState {
  readonly osTarget: OperatingSystemTarget;
  readonly networkMode: DesktopNetworkMode;
  readonly activeTheme: UIThemeMode;
  readonly direction: LayoutDirection;
  readonly locale: AcademicLanguageLocale;
  readonly openWindowsCount: number;
  readonly activePluginsCount: number;
  readonly memoryUsageMB: number;
  readonly isCrashRecovered: boolean;
}

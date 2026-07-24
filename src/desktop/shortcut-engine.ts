/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Global Keyboard Shortcuts & Academic Keybindings Engine
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface KeybindingRule {
  readonly shortcutCombo: string;
  readonly descriptionArabic: string;
  readonly commandId: string;
}

export class ShortcutEngine {
  private keybindings: Map<string, KeybindingRule> = new Map();

  constructor() {
    this.registerShortcut('Ctrl+K', 'فتح لوحة الأوامر الشاملة', 'cmd-open-palette');
    this.registerShortcut('Ctrl+S', 'حفظ الملاحظة الأكاديمية الحالية', 'cmd-save-note');
    this.registerShortcut('F11', 'تبديل ملء الشاشة الأكاديمي', 'cmd-toggle-fullscreen');
  }

  public registerShortcut(
    shortcutCombo: string,
    descriptionArabic: string,
    commandId: string
  ): Result<KeybindingRule, Error> {
    try {
      const rule: KeybindingRule = { shortcutCombo, descriptionArabic, commandId };
      this.keybindings.set(shortcutCombo, rule);
      return Result.ok(rule);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getRegisteredShortcuts(): Result<ReadonlyArray<KeybindingRule>, Error> {
    return Result.ok(Array.from(this.keybindings.values()));
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Universal Academic Command Palette Engine (Ctrl+Shift+P / Cmd+K)
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { CommandPaletteAction } from './desktop-types';

export class CommandPaletteEngine {
  private actions: Map<string, CommandPaletteAction> = new Map();

  constructor() {
    this.registerDefaultCommands();
  }

  public registerCommand(action: CommandPaletteAction): Result<void, Error> {
    this.actions.set(action.commandId, action);
    return Result.ok(undefined);
  }

  public searchCommands(queryArabicOrEn: string): Result<ReadonlyArray<CommandPaletteAction>, Error> {
    const q = queryArabicOrEn.toLowerCase().trim();
    if (!q) {
      return Result.ok(Array.from(this.actions.values()));
    }

    const matches = Array.from(this.actions.values()).filter(
      (a) => a.labelArabic.toLowerCase().includes(q) || a.commandId.toLowerCase().includes(q)
    );

    return Result.ok(matches);
  }

  private registerDefaultCommands(): void {
    this.registerCommand({
      commandId: 'cmd-open-manuscript',
      labelArabic: 'فتح مخطوطة أو بردية قبطية/يونانية',
      category: 'library',
      shortcutKeys: 'Ctrl+O',
      actionFn: () => {}
    });

    this.registerCommand({
      commandId: 'cmd-export-bibtex',
      labelArabic: 'تصدير المراجع والمصادر بصيغة BibTeX',
      category: 'workspace',
      shortcutKeys: 'Ctrl+Shift+B',
      actionFn: () => {}
    });

    this.registerCommand({
      commandId: 'cmd-ai-synthesize',
      labelArabic: 'تشغيل التحليل الآبائي الذكي بالذكاء الاصطناعي',
      category: 'ai',
      shortcutKeys: 'Ctrl+Shift+A',
      actionFn: () => {}
    });
  }
}

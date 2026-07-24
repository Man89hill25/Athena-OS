/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Desktop Docking Bar & Quick Launcher Engine
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface DockLauncherItem {
  readonly itemId: string;
  readonly labelArabic: string;
  readonly iconName: string;
  readonly targetModule: string;
  readonly isActive: boolean;
}

export class DockEngine {
  private dockItems: Map<string, DockLauncherItem> = new Map();

  constructor() {
    this.addDockItem('dock-manuscripts', 'المخطوطات والبردية', 'book-open', 'manuscript-engine', true);
    this.addDockItem('dock-notebook', 'دفتر الملاحظات والمعرفة', 'file-text', 'knowledge-notebook', false);
    this.addDockItem('dock-rag-search', 'المحرك الآبائي RAG', 'search', 'rag-engine', false);
    this.addDockItem('dock-library', 'المكتبة الرقمية والكتالوجات', 'database', 'digital-library', false);
  }

  public addDockItem(
    itemId: string,
    labelArabic: string,
    iconName: string,
    targetModule: string,
    isActive = false
  ): Result<DockLauncherItem, Error> {
    try {
      const item: DockLauncherItem = { itemId, labelArabic, iconName, targetModule, isActive };
      this.dockItems.set(itemId, item);
      return Result.ok(item);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getDockItems(): Result<ReadonlyArray<DockLauncherItem>, Error> {
    return Result.ok(Array.from(this.dockItems.values()));
  }
}

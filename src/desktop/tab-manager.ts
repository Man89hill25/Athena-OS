/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Multi-Tab Document Workspace Manager
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export interface TabItem {
  readonly tabId: UUID;
  readonly titleArabic: string;
  readonly documentType: 'manuscript' | 'note' | 'pdf' | 'comparison' | 'graph';
  readonly isActive: boolean;
  readonly isPinned: boolean;
  readonly isDirty: boolean;
}

export class TabManagerEngine {
  private tabs: Map<UUID, TabItem> = new Map();

  constructor() {
    this.openTab('بردية بودمر Q1 - إنجيل يوحنا بالقبطية الصعيدية', 'manuscript', true);
  }

  public openTab(
    titleArabic: string,
    documentType: 'manuscript' | 'note' | 'pdf' | 'comparison' | 'graph',
    makeActive = true
  ): Result<TabItem, Error> {
    try {
      const tabId = `tab-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (makeActive) {
        for (const [id, t] of this.tabs.entries()) {
          this.tabs.set(id, { ...t, isActive: false });
        }
      }

      const tab: TabItem = {
        tabId,
        titleArabic,
        documentType,
        isActive: makeActive,
        isPinned: false,
        isDirty: false
      };

      this.tabs.set(tabId, tab);
      return Result.ok(tab);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public closeTab(tabId: UUID): Result<void, Error> {
    if (!this.tabs.has(tabId)) {
      return Result.fail(new Error(`Tab ${tabId} not found.`));
    }
    this.tabs.delete(tabId);
    return Result.ok(undefined);
  }

  public getOpenTabs(): Result<ReadonlyArray<TabItem>, Error> {
    return Result.ok(Array.from(this.tabs.values()));
  }
}

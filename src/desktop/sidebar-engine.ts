/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Desktop Collapsible Activity Sidebar Engine
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface SidebarSection {
  readonly sectionId: string;
  readonly titleArabic: string;
  readonly iconName: string;
  readonly isExpanded: boolean;
}

export class SidebarEngine {
  private isSidebarCollapsed: boolean = false;
  private sections: Map<string, SidebarSection> = new Map();

  constructor() {
    this.registerSection('sec-file-explorer', 'مستكشف شجرة المخطوطات والملفات', 'folder', true);
    this.registerSection('sec-knowledge-graph', 'شجرة الروابط الآبائية المعرفية', 'git-branch', true);
    this.registerSection('sec-bookmarks', 'العلامات المرجعية والأقسام المفضلة', 'bookmark', false);
  }

  public registerSection(
    sectionId: string,
    titleArabic: string,
    iconName: string,
    isExpanded = true
  ): Result<SidebarSection, Error> {
    try {
      const section: SidebarSection = { sectionId, titleArabic, iconName, isExpanded };
      this.sections.set(sectionId, section);
      return Result.ok(section);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public toggleSidebar(): Result<boolean, Error> {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    return Result.ok(this.isSidebarCollapsed);
  }

  public getSidebarSections(): Result<ReadonlyArray<SidebarSection>, Error> {
    return Result.ok(Array.from(this.sections.values()));
  }
}

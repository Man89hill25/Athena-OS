/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Text Highlighting & Color-Coded Categorization Engine
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'purple' | 'red';

export interface TextHighlight {
  readonly highlightId: UUID;
  readonly documentId: UUID;
  readonly highlightedText: string;
  readonly color: HighlightColor;
  readonly categoryTagArabic: string;
}

export class HighlightEngine {
  private highlights: Map<UUID, TextHighlight> = new Map();

  public createHighlight(
    documentId: UUID,
    highlightedText: string,
    color: HighlightColor = 'yellow',
    categoryTagArabic: string = 'اقتباس مهم'
  ): Result<TextHighlight, Error> {
    try {
      const highlightId = `hl-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const hl: TextHighlight = {
        highlightId,
        documentId,
        highlightedText,
        color,
        categoryTagArabic
      };

      this.highlights.set(highlightId, hl);
      return Result.ok(hl);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getHighlightsByDocument(docId: UUID): Result<ReadonlyArray<TextHighlight>, Error> {
    try {
      const list = Array.from(this.highlights.values()).filter((h) => h.documentId === docId);
      return Result.ok(list);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

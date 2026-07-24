/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Full-Text Full-Inverted Index & Semantic Search Indexer
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LibraryItemRecord } from './library-types';

export class IndexingEngine {
  private invertedIndex: Map<string, Set<string>> = new Map();

  public indexRecord(item: LibraryItemRecord): Result<void, Error> {
    try {
      const text = `${item.title} ${item.authorOrCreator} ${item.dublinCore.description} ${item.dublinCore.subject.join(' ')}`;
      const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);

      for (const tok of tokens) {
        if (!this.invertedIndex.has(tok)) {
          this.invertedIndex.set(tok, new Set());
        }
        this.invertedIndex.get(tok)!.add(item.itemId);
      }

      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public queryInvertedIndex(term: string): Result<ReadonlySet<string>, Error> {
    const cleanTerm = term.trim().toLowerCase();
    const set = this.invertedIndex.get(cleanTerm) || new Set<string>();
    return Result.ok(set);
  }
}

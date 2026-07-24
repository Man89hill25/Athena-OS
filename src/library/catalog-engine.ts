/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Master Catalog Search & Bibliographic Query Engine
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LibraryItemRecord, CollectionType } from './library-types';

export interface CatalogSearchFilter {
  readonly query?: string;
  readonly collectionType?: CollectionType;
  readonly language?: string;
  readonly author?: string;
}

export class CatalogEngine {
  private items: Map<string, LibraryItemRecord> = new Map();

  public registerItem(item: LibraryItemRecord): Result<void, Error> {
    try {
      this.items.set(item.itemId, item);
      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getItemById(itemId: string): Result<LibraryItemRecord | undefined, Error> {
    return Result.ok(this.items.get(itemId));
  }

  public searchCatalog(filter: CatalogSearchFilter): Result<ReadonlyArray<LibraryItemRecord>, Error> {
    try {
      let results = Array.from(this.items.values());

      if (filter.collectionType) {
        results = results.filter((i) => i.collectionType === filter.collectionType);
      }

      if (filter.language) {
        results = results.filter((i) => i.primaryLanguage === filter.language);
      }

      if (filter.author) {
        const cleanAuth = filter.author.toLowerCase();
        results = results.filter((i) => i.authorOrCreator.toLowerCase().includes(cleanAuth));
      }

      if (filter.query) {
        const cleanQ = filter.query.toLowerCase();
        results = results.filter(
          (i) =>
            i.title.toLowerCase().includes(cleanQ) ||
            i.authorOrCreator.toLowerCase().includes(cleanQ) ||
            i.dublinCore.description.toLowerCase().includes(cleanQ) ||
            i.dublinCore.subject.some((s) => s.toLowerCase().includes(cleanQ))
        );
      }

      return Result.ok(results);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getAllItemsCount(): number {
    return this.items.size;
  }
}

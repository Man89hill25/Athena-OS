/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Library Agent & Academic Orchestrator
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LibraryItemRecord, CollectionType } from './library-types';
import { LibraryEngine } from './library-engine';

export class LibraryAgent {
  private libraryEngine = new LibraryEngine();

  public async searchAndCatalog(
    query?: string,
    collectionType?: CollectionType
  ): Promise<Result<ReadonlyArray<LibraryItemRecord>, Error>> {
    return this.libraryEngine.searchLibrary(query, collectionType);
  }

  public async getExportableMetadata(itemId: string): Promise<Result<{
    xmlDc: string;
    marc21Text: string;
    marcXml: string;
    modsXml: string;
    metsXml: string;
  }, Error>> {
    return this.libraryEngine.exportItemMetadata(itemId);
  }
}

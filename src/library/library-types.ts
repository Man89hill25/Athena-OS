/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Digital Library Domain Types & Metadata Specifications
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type CollectionType = 
  | 'book'
  | 'journal'
  | 'manuscript'
  | 'archive'
  | 'image'
  | 'audio'
  | 'video'
  | 'patristic'
  | 'canonical';

export type DocumentFileFormat =
  | 'pdf'
  | 'epub'
  | 'docx'
  | 'rtf'
  | 'html'
  | 'xml'
  | 'tei'
  | 'markdown'
  | 'iiif';

export interface PersistentIdentifiers {
  readonly isbn?: string;
  readonly issn?: string;
  readonly doi?: string;
  readonly ark?: string;
  readonly handle?: string;
  readonly orcid?: string;
}

export interface DublinCoreMetadata {
  readonly title: string;
  readonly creator: string;
  readonly subject: ReadonlyArray<string>;
  readonly description: string;
  readonly publisher: string;
  readonly contributor?: string;
  readonly date: string;
  readonly type: CollectionType;
  readonly format: DocumentFileFormat;
  readonly identifier: string;
  readonly source?: string;
  readonly language: string;
  readonly relation?: string;
  readonly coverage?: string;
  readonly rights: string;
}

export interface IIIFManifestPayload {
  readonly manifestUri: string;
  readonly label: string;
  readonly summary: string;
  readonly canvasesCount: number;
  readonly iiifVersion: '3.0' | '2.1';
  readonly thumbnailUri?: string;
}

export interface LibraryItemRecord {
  readonly itemId: UUID;
  readonly title: string;
  readonly authorOrCreator: string;
  readonly collectionType: CollectionType;
  readonly primaryLanguage: string;
  readonly dublinCore: DublinCoreMetadata;
  readonly identifiers: PersistentIdentifiers;
  readonly isDigitalAssetAvailable: boolean;
  readonly format: DocumentFileFormat;
  readonly downloadOrViewUri: string;
  readonly iiifManifest?: IIIFManifestPayload;
  readonly createdTimestamp: ISO8601Timestamp;
}

export interface LibraryCollection {
  readonly collectionId: UUID;
  readonly name: string;
  readonly descriptionArabic: string;
  readonly collectionType: CollectionType;
  readonly itemCount: number;
  readonly isPublic: boolean;
}

export interface BorrowingRecord {
  readonly loanId: UUID;
  readonly itemId: UUID;
  readonly borrowerName: string;
  readonly borrowedTimestamp: ISO8601Timestamp;
  readonly dueTimestamp: ISO8601Timestamp;
  readonly isReturned: boolean;
}

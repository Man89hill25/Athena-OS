/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC RAG INTELLIGENCE ENGINE
 * Subsystem: Document Types & Metamodel
 * 
 * Directive: 207 (Academic RAG Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type SupportedDocumentFormat = 'pdf' | 'markdown' | 'txt' | 'tei_xml' | 'epub';

export type AcademicLanguage = 
  | 'ar'  // Arabic
  | 'en'  // English
  | 'grc' // Ancient Greek
  | 'cop' // Coptic
  | 'syr' // Syriac
  | 'la'  // Latin
  | 'he'  // Hebrew
  | 'gez'; // Ge'ez

export interface AcademicAuthor {
  readonly name: string;
  readonly originalLanguageName?: string;
  readonly era?: string; // e.g. '4th Century Patristic', 'Nicaea Council'
  readonly authorityScore: number; // 0.0 - 1.0
}

export interface DocumentMetadata {
  readonly documentId: UUID;
  readonly title: string;
  readonly originalTitle?: string;
  readonly authors: ReadonlyArray<AcademicAuthor>;
  readonly primaryLanguage: AcademicLanguage;
  readonly secondaryLanguages: ReadonlyArray<AcademicLanguage>;
  readonly format: SupportedDocumentFormat;
  readonly edition?: string;
  readonly publisherOrCodex?: string;
  readonly publicationYear?: number;
  readonly totalPagesOrFolios?: number;
  readonly tags: ReadonlyArray<string>;
  readonly sourceUri?: string;
  readonly createdAt: ISO8601Timestamp;
}

export interface TEIXMLSectionMetadata {
  readonly divType?: string; // e.g., 'book', 'chapter', 'section', 'canon'
  readonly divNumber?: string;
  readonly headTitle?: string;
  readonly xmlId?: string;
}

export interface CitationAnchor {
  readonly workTitle: string;
  readonly bookOrVolume?: string;
  readonly chapterOrSection?: string;
  readonly verseOrLine?: string;
  readonly standardRefStr: string; // e.g., 'PG 25, 120' or 'Athanasius, De Incarnatione 5.1'
}

export interface ChunkMetadata {
  readonly chunkId: UUID;
  readonly documentId: UUID;
  readonly chunkIndex: number;
  readonly startCharIndex: number;
  readonly endCharIndex: number;
  readonly pageOrFolioNumber?: number;
  readonly primaryLanguage: AcademicLanguage;
  readonly teiMetadata?: TEIXMLSectionMetadata;
  readonly citationAnchors: ReadonlyArray<CitationAnchor>;
  readonly extractedEntities: ReadonlyArray<string>;
  readonly tokenCount: number;
}

export interface DocumentChunk {
  readonly chunkId: UUID;
  readonly documentId: UUID;
  readonly content: string;
  readonly normalizedContent: string; // Stripped of tashkeel/diacritics for BM25
  readonly metadata: ChunkMetadata;
  readonly embedding?: ReadonlyArray<number>;
  readonly academicAuthorityScore: number; // Inherited from document/author
}

export interface ParsedDocument {
  readonly metadata: DocumentMetadata;
  readonly rawText: string;
  readonly normalizedText: string;
  readonly chunks: ReadonlyArray<DocumentChunk>;
  readonly teiSections?: ReadonlyArray<{
    readonly title: string;
    readonly content: string;
    readonly metadata: TEIXMLSectionMetadata;
  }>;
}

export interface ChunkingOptions {
  readonly maxChunkSizeTokens: number; // e.g. 512
  readonly overlapTokens: number; // e.g. 64
  readonly preserveParagraphs: boolean;
  readonly preserveTEIStructure: boolean;
  readonly extractCitationAnchors: boolean;
}

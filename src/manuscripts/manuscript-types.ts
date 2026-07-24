/**
 * ==========================================================================================================
 * ATHENA X - MANUSCRIPT INTELLIGENCE PLATFORM
 * Subsystem: Manuscript Domain Types & Metamodel
 * 
 * Directive: 208 (Manuscript Intelligence Platform)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type ManuscriptFormat = 'Codex' | 'Papyrus' | 'Scroll' | 'Printed Edition' | 'Digital Manuscript';

export type HistoricalScriptType = 
  | 'Uncial' 
  | 'Minuscule' 
  | 'Coptic Uncial' 
  | 'Kufic' 
  | 'Naskh' 
  | 'Estrangelo' 
  | 'Serto' 
  | 'Caroline Minuscule' 
  | 'Square Hebrew';

export type ManuscriptLanguage = 'Coptic' | 'Greek' | 'Arabic' | 'Syriac' | 'Latin' | 'Hebrew' | 'Ge\'ez';

export interface ManuscriptRepository {
  readonly name: string; // e.g. 'British Library', 'Vatican Apostolic Library', 'St. Catherine Monastery'
  readonly city: string;
  readonly country: string;
}

export interface ProvenanceHistory {
  readonly originPlace?: string;
  readonly scribeName?: string;
  readonly patronOrDonor?: string;
  readonly historicalOwners: ReadonlyArray<string>;
  readonly century: number; // e.g., 4 for 4th century
}

export interface TextualVariant {
  readonly variantId: UUID;
  readonly locationRef: string; // e.g., 'Folio 12r, line 5' or 'John 1:18'
  readonly baseText: string;
  readonly variantText: string;
  readonly witnessShelfmarks: ReadonlyArray<string>; // Manuscripts attesting to this variant
  readonly classification: 'Orthographic' | 'Omission' | 'Addition' | 'Substitution' | 'Theological Variant';
}

export interface ManuscriptMetadata {
  readonly manuscriptId: UUID;
  readonly title: string;
  readonly format: ManuscriptFormat;
  readonly repository: ManuscriptRepository;
  readonly shelfmark: string; // e.g., 'MS Copt. 1', 'Codex Sinaiticus'
  readonly estimatedDate: string; // e.g., 'c. 330-360 CE'
  readonly dateCentury: number;
  readonly primaryLanguage: ManuscriptLanguage;
  readonly scriptType: HistoricalScriptType;
  readonly provenance: ProvenanceHistory;
  readonly folioCount: number;
  readonly isDigitized: boolean;
  readonly digitalImageUris: ReadonlyArray<string>;
  readonly createdAt: ISO8601Timestamp;
}

export interface FolioPage {
  readonly folioId: UUID;
  readonly manuscriptId: UUID;
  readonly folioNumber: string; // e.g., 'Folio 1r', 'Folio 1v'
  readonly imageUri: string;
  readonly dimensionsPixels: { width: number; height: number };
  readonly transcribeText?: string;
  readonly confidenceScore: number;
}

export interface CriticalApparatusEntry {
  readonly entryId: UUID;
  readonly passageRef: string;
  readonly lemma: string; // Base reading
  readonly variants: ReadonlyArray<{
    readonly reading: string;
    readonly witnesses: ReadonlyArray<string>;
    readonly notes?: string;
  }>;
}

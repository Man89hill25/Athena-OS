/**
 * ==========================================================================================================
 * ATHENA X - PATRISTIC & THEOLOGICAL INTELLIGENCE ENGINE
 * Subsystem: Patristic Domain Types & Metamodel
 * 
 * Directive: 209 (Patristic & Theological Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type PatristicTradition = 'Greek' | 'Latin' | 'Syriac' | 'Coptic' | 'Arabic';

export type TheologicalSchool = 
  | 'Alexandrian' 
  | 'Antiochene' 
  | 'Cappadocian' 
  | 'Latin Western' 
  | 'Edessan/Nisibene' 
  | 'Monastic Desert Tradition';

export type CorpusType = 
  | 'Patrologia Graeca' 
  | 'Patrologia Latina' 
  | 'Coptic Patrology' 
  | 'Syriac Patrology' 
  | 'Arabic Christian Heritage';

export interface ChurchFather {
  readonly fatherId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly originalLanguageName?: string;
  readonly titleOrEpithet: string; // e.g., 'Athanasius the Apostolic', 'Cyril Pillar of Faith'
  readonly tradition: PatristicTradition;
  readonly school: TheologicalSchool;
  readonly period: string; // e.g. 'c. 296 – 373 CE'
  readonly century: number;
  readonly primaryLanguage: string;
  readonly monasticTradition?: string;
  readonly biographySummary: string;
  readonly confidenceScore: number;
}

export interface PatristicWork {
  readonly workId: UUID;
  readonly fatherId: UUID;
  readonly title: string;
  readonly arabicTitle: string;
  readonly originalLanguageTitle: string;
  readonly corpus: CorpusType;
  readonly corpusRefStr?: string; // e.g., 'PG 25, 95-198'
  readonly century: number;
  readonly originalLanguage: string;
  readonly summary: string;
  readonly manuscriptWitnesses: ReadonlyArray<string>;
  readonly bibliography: ReadonlyArray<string>;
}

export interface TheologicalConcept {
  readonly conceptId: UUID;
  readonly term: string;
  readonly arabicTerm: string;
  readonly originalTerm: string; // e.g., 'Homoousios (ὁμοούσιος)'
  readonly language: string;
  readonly definition: string;
  readonly associatedDoctrines: ReadonlyArray<string>;
}

export interface Doctrine {
  readonly doctrineId: UUID;
  readonly title: string;
  readonly arabicTitle: string;
  readonly description: string;
  readonly keyFathers: ReadonlyArray<UUID>;
  readonly keyWorks: ReadonlyArray<UUID>;
  readonly councilReferences: ReadonlyArray<string>;
}

export interface CouncilReference {
  readonly councilId: UUID;
  readonly councilName: string;
  readonly arabicName: string;
  readonly yearCE: number;
  readonly location: string;
  readonly ecumenicalStatus: 'Ecumenical' | 'Local' | 'Regional';
  readonly canonsAndDecrees: ReadonlyArray<string>;
  readonly defenderFathers: ReadonlyArray<UUID>;
}

export interface BiblicalCommentary {
  readonly commentaryId: UUID;
  readonly fatherId: UUID;
  readonly workId: UUID;
  readonly biblicalBook: string;
  readonly chapterVerseRef: string; // e.g., 'John 1:1'
  readonly commentaryText: string;
  readonly theologicalThemes: ReadonlyArray<string>;
}

export interface PatristicCitation {
  readonly citationId: UUID;
  readonly workId: UUID;
  readonly passageRef: string; // e.g., 'De Incarnatione 54.3'
  readonly textSnippet: string;
  readonly corpusRef: string; // e.g., 'PG 25, 192'
  readonly confidenceScore: number;
}

export interface TranslationRecord {
  readonly translationId: UUID;
  readonly workId: UUID;
  readonly targetLanguage: string;
  readonly translatorName: string;
  readonly translatedText: string;
  readonly publicationYear?: number;
}

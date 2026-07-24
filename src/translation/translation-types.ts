/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Translation Types & Domain Specifications
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type AncientLanguageCode =
  | 'grc' // Koine / Ancient Greek
  | 'cop' // Coptic (Bohairic / Sahidic)
  | 'syr' // Classical Syriac
  | 'lat' // Patristic / Classical Latin
  | 'heb' // Biblical Hebrew
  | 'arc' // Biblical Aramaic
  | 'gez' // Ge'ez (Ethiopic)
  | 'ara' // Classical / Modern Academic Arabic
  | 'eng'; // English Academic Standard

export interface MorphologicalAnalysis {
  readonly lemma: string;
  readonly root?: string;
  readonly partOfSpeech: string; // Noun, Verb, Adjective, Preposition, Article
  readonly grammaticalCase?: string; // Nominative, Genitive, Dative, Accusative, Vocative
  readonly number?: 'singular' | 'plural' | 'dual';
  readonly gender?: 'masculine' | 'feminine' | 'neuter';
  readonly tense?: 'present' | 'aorist' | 'imperfect' | 'perfect' | 'pluperfect' | 'future';
  readonly voice?: 'active' | 'middle' | 'passive';
  readonly mood?: 'indicative' | 'subjunctive' | 'optative' | 'imperative' | 'infinitive' | 'participle';
  readonly StrongsNumber?: string;
}

export interface InterlinearWordAlignment {
  readonly originalIndex: number;
  readonly originalText: string;
  readonly transliteration: string;
  readonly morphology: MorphologicalAnalysis;
  readonly literalTranslationArabic: string;
  readonly EnglishGloss: string;
}

export interface InterlinearVersePayload {
  readonly verseId: UUID;
  readonly sourceLanguage: AncientLanguageCode;
  readonly rawSourceText: string;
  readonly wordAlignments: ReadonlyArray<InterlinearWordAlignment>;
  readonly synthesizedArabicTranslation: string;
  readonly academicNotes: ReadonlyArray<string>;
}

export interface LexiconEntry {
  readonly entryId: UUID;
  readonly word: string;
  readonly language: AncientLanguageCode;
  readonly transliteration: string;
  readonly StrongsOrLSJIndex?: string;
  readonly primaryArabicMeaning: string;
  readonly secondaryArabicMeanings: ReadonlyArray<string>;
  readonly etymologyNoteArabic?: string;
  readonly patristicUsageOccurrencesCount: number;
}

export interface TranslationMemoryPair {
  readonly pairId: UUID;
  readonly sourceText: string;
  readonly sourceLanguage: AncientLanguageCode;
  readonly targetTranslationArabic: string;
  readonly targetLanguage: 'ara';
  readonly domainContext: 'patristic' | 'scripture' | 'canonical' | 'liturgical';
  readonly confidenceScore: number;
}

export interface AcademicTranslationRequest {
  readonly requestId: UUID;
  readonly sourceText: string;
  readonly sourceLanguage: AncientLanguageCode;
  readonly targetLanguage: 'ara' | 'eng';
  readonly preserveCitations: boolean;
  readonly includeInterlinear: boolean;
  readonly domainContext?: 'patristic' | 'scripture' | 'canonical' | 'liturgical';
}

export interface AcademicTranslationResponse {
  readonly requestId: UUID;
  readonly originalSourceText: string;
  readonly translatedTextArabic: string;
  readonly interlinearPayload?: InterlinearVersePayload;
  readonly detectedTerms: ReadonlyArray<LexiconEntry>;
  readonly confidenceScore: number;
  readonly executionTimeMs: number;
  readonly createdTimestamp: ISO8601Timestamp;
}

/**
 * ==========================================================================================================
 * ATHENA X - BIBLICAL SCRIPTURE INTELLIGENCE ENGINE
 * Subsystem: Domain Types & Metamodel
 * 
 * Directive: 210 (Biblical Scripture Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type TestamentType = 'Old Testament' | 'New Testament' | 'Deuterocanonical';

export type BiblicalLanguage = 
  | 'Hebrew' 
  | 'Aramaic' 
  | 'Greek Koine' 
  | 'Latin Vulgate' 
  | 'Syriac Peshitta' 
  | 'Coptic' 
  | 'Arabic' 
  | 'English';

export type TextualCorpusFamily = 
  | 'Septuagint' 
  | 'Masoretic Text' 
  | 'Textus Receptus' 
  | 'Byzantine Text' 
  | 'Critical Greek Text' 
  | 'Vulgate' 
  | 'Peshitta' 
  | 'Coptic Biblical Text'
  | 'Arabic Bible Traditions';

export interface ScriptureReference {
  readonly bookName: string;
  readonly bookArabicName: string;
  readonly chapterNumber: number;
  readonly verseNumber: number;
  readonly endVerseNumber?: number;
  readonly standardRefStr: string; // e.g., 'John 1:1' or 'يوحنا 1: 1'
}

export interface BibleVerse {
  readonly verseId: UUID;
  readonly reference: ScriptureReference;
  readonly text: string;
  readonly normalizedText: string;
  readonly language: BiblicalLanguage;
  readonly corpusFamily: TextualCorpusFamily;
  readonly translationVersion: string; // e.g., 'Smith-Van Dyck (SVD)', 'LXX', 'SBLGNT', 'Peshitta'
  readonly manuscriptSource?: string;
  readonly textualConfidence: number;
}

export interface BibleChapter {
  readonly chapterId: UUID;
  readonly bookName: string;
  readonly chapterNumber: number;
  readonly verses: ReadonlyArray<BibleVerse>;
  readonly totalVerses: number;
}

export interface BibleBook {
  readonly bookId: UUID;
  readonly bookName: string;
  readonly arabicName: string;
  readonly testament: TestamentType;
  readonly originalLanguage: BiblicalLanguage;
  readonly totalChapters: number;
  readonly isDeuterocanonical: boolean;
  readonly chapters: ReadonlyArray<BibleChapter>;
}

export interface ManuscriptWitness {
  readonly witnessId: UUID;
  readonly manuscriptName: string; // e.g., 'Codex Vaticanus (B)', 'Codex Sinaiticus (א)'
  readonly shelfmark: string;
  readonly century: number;
  readonly language: BiblicalLanguage;
  readonly textSnippet: string;
  readonly reliabilityScore: number;
}

export interface TextualVariant {
  readonly variantId: UUID;
  readonly locationRef: ScriptureReference;
  readonly lemmaText: string; // Base reading
  readonly variantText: string; // Variant reading
  readonly classification: 'Addition' | 'Deletion' | 'Substitution' | 'Orthographic Variation' | 'Translation Difference';
  readonly witnesses: ReadonlyArray<ManuscriptWitness>;
  readonly scholarlyNotes: string;
}

export interface TranslationVersion {
  readonly versionId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly code: string; // e.g., 'SVD', 'LXX', 'VUL', 'PESH'
  readonly targetLanguage: BiblicalLanguage;
  readonly isCriticalEdition: boolean;
  readonly yearPublished?: number;
}

export interface ExegeticalNote {
  readonly noteId: UUID;
  readonly verseRef: ScriptureReference;
  readonly authorOrFather: string;
  readonly noteText: string;
  readonly theologicalThemes: ReadonlyArray<string>;
  readonly patristicReference?: string;
}

export interface CrossReference {
  readonly crossRefId: UUID;
  readonly sourceRef: ScriptureReference;
  readonly targetRef: ScriptureReference;
  readonly connectionType: 'Direct Quote' | 'Allusion' | 'Typological Fulfillment' | 'Theological Parallel';
  readonly relevanceScore: number;
}

export interface TheologicalTheme {
  readonly themeId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly description: string;
  readonly keyVerses: ReadonlyArray<ScriptureReference>;
}

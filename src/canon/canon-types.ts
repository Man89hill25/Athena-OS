/**
 * ==========================================================================================================
 * ATHENA X - CANONICAL LAW & ECCLESIASTICAL KNOWLEDGE INTELLIGENCE ENGINE
 * Subsystem: Domain Types & Metamodel
 * 
 * Directive: 211 (Canonical Law & Ecclesiastical Knowledge Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type CanonicalTradition = 
  | 'Eastern Orthodox Canon Law' 
  | 'Oriental Orthodox Canon Law' 
  | 'Catholic Canon Law' 
  | 'Byzantine Canonical Tradition' 
  | 'Coptic Canonical Tradition' 
  | 'Syriac Canonical Tradition' 
  | 'Ancient Church Orders';

export type Jurisdiction = 
  | 'Alexandria' 
  | 'Antioch' 
  | 'Rome' 
  | 'Constantinople' 
  | 'Jerusalem' 
  | 'Universal Ecumenical';

export type CanonicalLanguage = 'Greek' | 'Latin' | 'Coptic' | 'Syriac' | 'Arabic';

export interface ChurchAuthority {
  readonly authorityId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly title: string; // e.g. 'Patriarch of Alexandria', 'Bishop of Rome', 'Council Presidium'
  readonly jurisdiction: Jurisdiction;
  readonly century: number;
}

export interface CanonicalSource {
  readonly sourceId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly origin: string;
  readonly dateStr: string; // e.g. 'c. 325 CE'
  readonly language: CanonicalLanguage;
  readonly manuscriptWitness: string;
  readonly historicalConfidence: number;
  readonly academicSources: ReadonlyArray<string>;
}

export interface EcclesiasticalCanon {
  readonly canonId: UUID;
  readonly canonNumber: number;
  readonly collectionTitle: string;
  readonly arabicTitle: string;
  readonly councilName?: string;
  readonly tradition: CanonicalTradition;
  readonly originalLanguage: CanonicalLanguage;
  readonly originalText: string;
  readonly arabicText: string;
  readonly EnglishText: string;
  readonly jurisdiction: Jurisdiction;
  readonly dateEnactedCE: number;
  readonly legalSubject: string; // e.g. 'Ordination & Clerical Discipline', 'Pascha Date', 'Hierarchy'
  readonly historicalConfidence: number;
}

export interface CanonLaw {
  readonly lawId: UUID;
  readonly canonId: UUID;
  readonly principle: string;
  readonly arabicPrinciple: string;
  readonly Scope: string;
  readonly bindingStatus: 'Binding' | 'Historical Guideline' | 'Local Custom';
}

export interface CouncilCanon {
  readonly councilCanonId: UUID;
  readonly councilName: string;
  readonly councilYearCE: number;
  readonly canonNumber: number;
  readonly canonText: string;
  readonly theologicalContext: string;
}

export interface SynodalDecision {
  readonly decisionId: UUID;
  readonly synodTitle: string;
  readonly arabicTitle: string;
  readonly yearCE: number;
  readonly jurisdiction: Jurisdiction;
  readonly decrees: ReadonlyArray<string>;
}

export interface CanonBook {
  readonly bookId: UUID;
  readonly title: string;
  readonly arabicTitle: string;
  readonly tradition: CanonicalTradition;
  readonly canons: ReadonlyArray<EcclesiasticalCanon>;
}

export interface CanonCollection {
  readonly collectionId: UUID;
  readonly name: string;
  readonly arabicName: string; // e.g. 'المجموعة القانونية القبطية (الدسقولية والسنكسار والقوانين 85)'
  readonly tradition: CanonicalTradition;
  readonly books: ReadonlyArray<CanonBook>;
  readonly totalCanonsCount: number;
}

export interface CanonicalCommentary {
  readonly commentaryId: UUID;
  readonly canonId: UUID;
  readonly commentatorName: string; // e.g. 'Ibn al-Assal', 'Zonaras', 'Balsamon'
  readonly century: number;
  readonly commentaryText: string;
  readonly tradition: CanonicalTradition;
}

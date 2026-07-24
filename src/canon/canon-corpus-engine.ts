/**
 * ==========================================================================================================
 * ATHENA X - CANONICAL LAW & ECCLESIASTICAL KNOWLEDGE INTELLIGENCE ENGINE
 * Subsystem: Canon Corpus Engine
 * 
 * Directive: 211 (Canonical Law & Ecclesiastical Knowledge Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { 
  EcclesiasticalCanon, 
  CanonCollection, 
  CanonBook, 
  CanonicalTradition, 
  Jurisdiction, 
  CanonicalLanguage 
} from './canon-types';

export interface CanonSearchFilter {
  readonly query?: string;
  readonly tradition?: CanonicalTradition;
  readonly councilName?: string;
  readonly jurisdiction?: Jurisdiction;
  readonly canonNumber?: number;
}

export class CanonCorpusEngine {
  private canons: Map<UUID, EcclesiasticalCanon> = new Map();
  private collections: Map<UUID, CanonCollection> = new Map();

  constructor() {
    this.seedCanonicalCorpus();
  }

  public registerCanon(canon: EcclesiasticalCanon): Result<UUID, Error> {
    try {
      this.canons.set(canon.canonId, canon);
      return Result.ok(canon.canonId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public registerCollection(collection: CanonCollection): Result<UUID, Error> {
    try {
      this.collections.set(collection.collectionId, collection);
      collection.books.forEach((book) => {
        book.canons.forEach((canon) => this.registerCanon(canon));
      });
      return Result.ok(collection.collectionId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getCanonById(id: UUID): Result<EcclesiasticalCanon, Error> {
    const canon = this.canons.get(id);
    if (!canon) {
      return Result.fail(new Error(`Ecclesiastical Canon ID ${id} not found.`));
    }
    return Result.ok(canon);
  }

  public queryCanons(filter: CanonSearchFilter): ReadonlyArray<EcclesiasticalCanon> {
    const all = Array.from(this.canons.values());
    return all.filter((c) => {
      if (filter.tradition && c.tradition !== filter.tradition) return false;
      if (filter.jurisdiction && c.jurisdiction !== filter.jurisdiction) return false;
      if (filter.councilName && (!c.councilName || !c.councilName.toLowerCase().includes(filter.councilName.toLowerCase()))) return false;
      if (filter.canonNumber && c.canonNumber !== filter.canonNumber) return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        const textMatch = 
          c.arabicText.toLowerCase().includes(q) ||
          c.EnglishText.toLowerCase().includes(q) ||
          c.originalText.toLowerCase().includes(q) ||
          c.collectionTitle.toLowerCase().includes(q);
        if (!textMatch) return false;
      }
      return true;
    });
  }

  public normalizeCanonText(text: string): string {
    return text
      .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim()
      .toLowerCase();
  }

  private seedCanonicalCorpus(): void {
    // Seed Apostolic Canons & Ecumenical Council Canons
    const canonNicaea1: EcclesiasticalCanon = {
      canonId: crypto.randomUUID(),
      canonNumber: 1,
      collectionTitle: 'Canons of the First Ecumenical Council of Nicaea (325 CE)',
      arabicTitle: 'قوانين مجمع نيقية المسكوني الأول',
      councilName: 'First Council of Nicaea',
      tradition: 'Byzantine Canonical Tradition',
      originalLanguage: 'Greek',
      originalText: 'Εἴ τις ἐν νόσῳ ὑπὸ ἰατρῶν ἐχειρουργήθη...',
      arabicText: 'إذا كان أحد قد أخصى نفسه في مرض على يد أطباء أو على يد برابرة، فليستمر في الإكليروس.',
      EnglishText: 'If anyone in sickness has been subjected by physicians to a surgical operation...',
      jurisdiction: 'Universal Ecumenical',
      dateEnactedCE: 325,
      legalSubject: 'Clerical Qualification',
      historicalConfidence: 0.99,
    };

    const canonNicaea6: EcclesiasticalCanon = {
      canonId: crypto.randomUUID(),
      canonNumber: 6,
      collectionTitle: 'Canons of Nicaea (Ancient Patriarchates Privileges)',
      arabicTitle: 'قانون نيقية السادس - حقوق الكراسي الرسولية القديمة',
      councilName: 'First Council of Nicaea',
      tradition: 'Coptic Canonical Tradition',
      originalLanguage: 'Greek',
      originalText: 'Τὰ ἀρχαῖα ἔθη κρατείτω τὰ ἐν Αἰγύπτῳ καὶ Λιβύῃ καὶ Πενταπόλει...',
      arabicText: 'لتكن العوائد القديمة قائمة في مصر وليبيا والخمس مدن، بحيث يكون لأسقف الإسكندرية السلطة على كل هذه.',
      EnglishText: 'Let the ancient customs in Egypt, Libya and Pentapolis prevail, that the Bishop of Alexandria have authority over all these...',
      jurisdiction: 'Alexandria',
      dateEnactedCE: 325,
      legalSubject: 'Patriarchal Jurisdiction',
      historicalConfidence: 0.99,
    };

    const apostolicCanon1: EcclesiasticalCanon = {
      canonId: crypto.randomUUID(),
      canonNumber: 1,
      collectionTitle: 'Apostolic Canons (Canones Apostolorum)',
      arabicTitle: 'قوانين الرسل الأطهار - القانون الأول',
      councilName: 'Apostolic Council Assembly',
      tradition: 'Ancient Church Orders',
      originalLanguage: 'Greek',
      originalText: 'Ἐπίσκοπος ὑπὸ ἐπισκόπων χειροτονείσθω δύο ἢ τριῶν.',
      arabicText: 'يُرسم الأسقف من أسقفين أو ثلاثة أساقفة.',
      EnglishText: 'Let a bishop be ordained by two or three bishops.',
      jurisdiction: 'Universal Ecumenical',
      dateEnactedCE: 100,
      legalSubject: 'Episcopal Ordination',
      historicalConfidence: 0.98,
    };

    const book1: CanonBook = {
      bookId: crypto.randomUUID(),
      title: 'Ecumenical Canons Volume I',
      arabicTitle: 'كتاب القوانين المسكونية - المجلد الأول',
      tradition: 'Byzantine Canonical Tradition',
      canons: [canonNicaea1, canonNicaea6, apostolicCanon1],
    };

    const collection: CanonCollection = {
      collectionId: crypto.randomUUID(),
      name: 'Syntagma Canonum & Nomocanon',
      arabicName: 'المجموعة القانونية الكنسية الشاملة (السينتاغما والنوموكانون)',
      tradition: 'Byzantine Canonical Tradition',
      books: [book1],
      totalCanonsCount: 3,
    };

    this.registerCollection(collection);
  }
}

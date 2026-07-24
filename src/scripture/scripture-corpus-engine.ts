/**
 * ==========================================================================================================
 * ATHENA X - BIBLICAL SCRIPTURE INTELLIGENCE ENGINE
 * Subsystem: Scripture Corpus Engine
 * 
 * Directive: 210 (Biblical Scripture Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import {
  BibleBook,
  BibleChapter,
  BibleVerse,
  ScriptureReference,
  TextualVariant,
  ManuscriptWitness,
  TranslationVersion,
  TextualCorpusFamily,
} from './scripture-types';

export interface ParallelVerseSet {
  readonly reference: ScriptureReference;
  readonly parallelVerses: ReadonlyArray<BibleVerse>;
}

export class ScriptureCorpusEngine {
  private books: Map<UUID, BibleBook> = new Map();
  private verseIndex: Map<string, BibleVerse[]> = new Map(); // Key: Standard Ref String (e.g. 'John 1:1')
  private manuscriptWitnesses: Map<UUID, ManuscriptWitness> = new Map();
  private textualVariants: Map<UUID, TextualVariant> = new Map();
  private translations: Map<string, TranslationVersion> = new Map();

  constructor() {
    this.seedCanonicalScriptureCorpus();
  }

  public registerBook(book: BibleBook): Result<UUID, Error> {
    try {
      this.books.set(book.bookId, book);
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          this.indexVerse(verse);
        }
      }
      return Result.ok(book.bookId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public indexVerse(verse: BibleVerse): void {
    const key = verse.reference.standardRefStr.toLowerCase();
    const existing = this.verseIndex.get(key) || [];
    existing.push(verse);
    this.verseIndex.set(key, existing);
  }

  public normalizeText(text: string): string {
    return text
      .trim()
      .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
      .replace(/[\u0300-\u036F]/g, '') // Remove Greek accents
      .toLowerCase();
  }

  public getParallelPassages(passageRefStr: string): Result<ParallelVerseSet, Error> {
    try {
      const key = passageRefStr.toLowerCase();
      const parallels = this.verseIndex.get(key) || [];
      if (parallels.length === 0) {
        return Result.fail(new Error(`No parallel passages found for reference: ${passageRefStr}`));
      }

      return Result.ok({
        reference: parallels[0].reference,
        parallelVerses: parallels,
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public addManuscriptWitness(witness: ManuscriptWitness): Result<UUID, Error> {
    try {
      this.manuscriptWitnesses.set(witness.witnessId, witness);
      return Result.ok(witness.witnessId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public registerTextualVariant(variant: TextualVariant): Result<UUID, Error> {
    try {
      this.textualVariants.set(variant.variantId, variant);
      return Result.ok(variant.variantId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getVariantsForReference(refStr: string): ReadonlyArray<TextualVariant> {
    return Array.from(this.textualVariants.values()).filter(
      (v) => v.locationRef.standardRefStr.toLowerCase() === refStr.toLowerCase()
    );
  }

  public getAllBooks(): ReadonlyArray<BibleBook> {
    return Array.from(this.books.values());
  }

  public getVerseIndex(): Map<string, BibleVerse[]> {
    return this.verseIndex;
  }

  private seedCanonicalScriptureCorpus(): void {
    const johnBookId = crypto.randomUUID();
    const johnChapter1Id = crypto.randomUUID();

    const johnRef: ScriptureReference = {
      bookName: 'John',
      bookArabicName: 'إنجيل يوحنا',
      chapterNumber: 1,
      verseNumber: 1,
      standardRefStr: 'John 1:1',
    };

    const greekVerse: BibleVerse = {
      verseId: crypto.randomUUID(),
      reference: johnRef,
      text: 'Ἐν ἀρχῇ ἦν ὁ Λόγος, καὶ ὁ Λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ Λόγος.',
      normalizedText: 'εν αρχη ην ο λογος',
      language: 'Greek Koine',
      corpusFamily: 'Critical Greek Text',
      translationVersion: 'SBLGNT',
      manuscriptSource: 'Codex Vaticanus (B)',
      textualConfidence: 0.99,
    };

    const arabicVerse: BibleVerse = {
      verseId: crypto.randomUUID(),
      reference: johnRef,
      text: 'فِي الْبَدْءِ كَانَ الْكَلِمَةُ، وَالْكَلِمَةُ كَانَ عِنْدَ اللهِ، وَكَانَ الْكَلِمَةُ اللهَ.',
      normalizedText: 'في البدء كان الكلمة وكان الكلمة عند الله وكان الكلمة الله',
      language: 'Arabic',
      corpusFamily: 'Arabic Bible Traditions',
      translationVersion: 'Smith-Van Dyck (SVD)',
      textualConfidence: 0.99,
    };

    const syriacVerse: BibleVerse = {
      verseId: crypto.randomUUID(),
      reference: johnRef,
      text: 'ܒܪܫܝܬ ܐܝܬܘܗܝ ܗܘܐ ܡܠܬܐ ܘܗܘ ܡܠܬܐ ܐܝܬܘܗܝ ܗܘܐ ܠܘܬ ܐܠܗܐ ܘܐܠܗܐ ܐܝܬܘܗܝ ܗܘܐ ܗܘ ܡܠܬܐ',
      normalizedText: 'ܒܪܫܝܬ ܐܝܬܘܗܝ ܗܘܐ ܡܠܬܐ',
      language: 'Syriac Peshitta',
      corpusFamily: 'Peshitta',
      translationVersion: 'Peshitta Critical Edition',
      textualConfidence: 0.98,
    };

    const johnChapter: BibleChapter = {
      chapterId: johnChapter1Id,
      bookName: 'John',
      chapterNumber: 1,
      verses: [greekVerse, arabicVerse, syriacVerse],
      totalVerses: 1,
    };

    const johnBook: BibleBook = {
      bookId: johnBookId,
      bookName: 'John',
      arabicName: 'إنجيل يوحنا',
      testament: 'New Testament',
      originalLanguage: 'Greek Koine',
      totalChapters: 21,
      isDeuterocanonical: false,
      chapters: [johnChapter],
    };

    this.registerBook(johnBook);

    // Deuterocanonical Sample Book (Wisdom of Solomon)
    const wisdomBookId = crypto.randomUUID();
    const wisdomRef: ScriptureReference = {
      bookName: 'Wisdom',
      bookArabicName: 'سفر حكمة سليمان',
      chapterNumber: 1,
      verseNumber: 1,
      standardRefStr: 'Wisdom 1:1',
    };

    const wisdomArabicVerse: BibleVerse = {
      verseId: crypto.randomUUID(),
      reference: wisdomRef,
      text: 'أَحِبُّوا الْعَدْلَ يَا قُضَاةَ الأَرْضِ، وَأَفْكِرُوا فِي الرَّبِّ بِخَيْرٍ، وَالْتَمِسُوهُ بِبَسَاطَةِ الْقَلْبِ.',
      normalizedText: 'احبوا العدل يا قضاة الارض',
      language: 'Arabic',
      corpusFamily: 'Septuagint',
      translationVersion: 'Deuterocanonical Arabic Translation',
      textualConfidence: 0.98,
    };

    const wisdomBook: BibleBook = {
      bookId: wisdomBookId,
      bookName: 'Wisdom of Solomon',
      arabicName: 'سفر حكمة سليمان',
      testament: 'Deuterocanonical',
      originalLanguage: 'Greek Koine',
      totalChapters: 19,
      isDeuterocanonical: true,
      chapters: [
        {
          chapterId: crypto.randomUUID(),
          bookName: 'Wisdom of Solomon',
          chapterNumber: 1,
          verses: [wisdomArabicVerse],
          totalVerses: 1,
        },
      ],
    };

    this.registerBook(wisdomBook);
  }
}

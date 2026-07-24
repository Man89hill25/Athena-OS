/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Multi-Dictionary & Patristic Lexicon Engine
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LexiconEntry, AncientLanguageCode } from './translation-types';

export class DictionaryEngine {
  private entries: Map<string, LexiconEntry> = new Map();

  constructor() {
    this.seedPatristicLexicon();
  }

  public registerEntry(entry: LexiconEntry): void {
    this.entries.set(entry.word.toLowerCase(), entry);
  }

  public lookupWord(word: string, language?: AncientLanguageCode): Result<LexiconEntry | undefined, Error> {
    try {
      const clean = word.trim().toLowerCase();
      const match = this.entries.get(clean);
      if (match && (!language || match.language === language)) {
        return Result.ok(match);
      }

      // Fuzzy lookup
      for (const entry of this.entries.values()) {
        if (entry.word.toLowerCase().includes(clean) || entry.transliteration.toLowerCase().includes(clean)) {
          return Result.ok(entry);
        }
      }

      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private seedPatristicLexicon(): void {
    const seed: LexiconEntry[] = [
      {
        entryId: 'lex-grc-logos',
        word: 'λόγος',
        language: 'grc',
        transliteration: 'Logos',
        StrongsOrLSJIndex: 'G3056',
        primaryArabicMeaning: 'الكلمة الإلهية / العقل المدبر',
        secondaryArabicMeanings: ['النطق', 'الأمر', 'الأقنوم الثاني'],
        etymologyNoteArabic: 'مصطلح آبائي يوناني يعبر عن أقنوم الإبن الكلمة المتجسد.',
        patristicUsageOccurrencesCount: 14200
      },
      {
        entryId: 'lex-grc-homoousios',
        word: 'ὁμοούσιος',
        language: 'grc',
        transliteration: 'Homoousios',
        StrongsOrLSJIndex: 'G3661',
        primaryArabicMeaning: 'مساوٍ في الجوهر',
        secondaryArabicMeanings: ['ذات الجوهر الواحد', 'واحد في الجوهر مع الآب'],
        etymologyNoteArabic: 'المصطلح النيقاوي الشهير لحسم الأريوسية بقمة مجمع نيقية 325م.',
        patristicUsageOccurrencesCount: 8900
      },
      {
        entryId: 'lex-cop-nouti',
        word: 'ⲛⲟⲩϯ',
        language: 'cop',
        transliteration: 'Nouti',
        primaryArabicMeaning: 'الله / الإله',
        secondaryArabicMeanings: ['الرب', 'الخالق'],
        patristicUsageOccurrencesCount: 6500
      },
      {
        entryId: 'lex-syr-melltha',
        word: 'ܡܠܬܐ',
        language: 'syr',
        transliteration: 'Melltha',
        primaryArabicMeaning: 'الكلمة',
        secondaryArabicMeanings: ['الأمر', 'القول'],
        patristicUsageOccurrencesCount: 7800
      }
    ];

    for (const e of seed) {
      this.registerEntry(e);
    }
  }
}

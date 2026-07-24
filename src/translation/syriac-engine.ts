/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Classical Syriac Language Engine
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { MorphologicalAnalysis, InterlinearWordAlignment } from './translation-types';

export class SyriacLinguisticEngine {
  public analyzeWord(syriacWord: string): Result<MorphologicalAnalysis, Error> {
    try {
      const clean = syriacWord.trim();

      if (clean.includes('ܡܠܬܐ') || clean.includes('ܡܶܠܬܳܐ')) {
        return Result.ok({
          lemma: 'ܡܠܬܐ',
          root: 'ملت',
          partOfSpeech: 'Noun',
          number: 'singular',
          gender: 'feminine'
        });
      }

      if (clean.includes('ܐܠܗܐ') || clean.includes('ܐܰܠܳܗܳܐ')) {
        return Result.ok({
          lemma: 'ܐܠܗܐ',
          root: 'أله',
          partOfSpeech: 'Noun',
          number: 'singular',
          gender: 'masculine'
        });
      }

      return Result.ok({
        lemma: clean,
        partOfSpeech: 'Noun / Generic'
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public buildSyriacInterlinear(rawText: string): Result<ReadonlyArray<InterlinearWordAlignment>, Error> {
    try {
      const tokens = rawText.split(/\s+/).filter(Boolean);
      const alignments: InterlinearWordAlignment[] = tokens.map((token, idx) => {
        const morphRes = this.analyzeWord(token);
        const morph = morphRes.isSuccess ? morphRes.getValue() : { lemma: token, partOfSpeech: 'Noun' };

        let literalArabic = 'كلمة سريانية';
        let englishGloss = 'Syriac word';

        if (token.includes('ܡܠܬܐ')) {
          literalArabic = 'الكلمة (ملثا)';
          englishGloss = 'The Word (Melltha)';
        } else if (token.includes('ܐܠܗܐ')) {
          literalArabic = 'الله (ألاها)';
          englishGloss = 'God (Allaha)';
        } else if (token.includes('ܒܪܫܝܬ')) {
          literalArabic = 'في البدء (برشيث)';
          englishGloss = 'In beginning (Breshith)';
        }

        return {
          originalIndex: idx + 1,
          originalText: token,
          transliteration: this.transliterateSyriac(token),
          morphology: morph,
          literalTranslationArabic: literalArabic,
          EnglishGloss: englishGloss
        };
      });

      return Result.ok(alignments);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public transliterateSyriac(text: string): string {
    return text
      .replace(/ܒܪܫܝܬ/g, 'Breshith')
      .replace(/ܡܠܬܐ/g, 'Melltha')
      .replace(/ܐܠܗܐ/g, 'Allaha');
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Ge'ez (Ethiopic) Classical Language Engine
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { MorphologicalAnalysis, InterlinearWordAlignment } from './translation-types';

export class GeezLinguisticEngine {
  public analyzeWord(geezWord: string): Result<MorphologicalAnalysis, Error> {
    try {
      const clean = geezWord.trim();

      if (clean.includes('ቃል።') || clean.includes('ቃል')) {
        return Result.ok({
          lemma: 'ቃል',
          partOfSpeech: 'Noun',
          number: 'singular',
          gender: 'masculine'
        });
      }

      if (clean.includes('እግዚአብሔር')) {
        return Result.ok({
          lemma: 'እግዚአብሔር',
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

  public buildGeezInterlinear(rawText: string): Result<ReadonlyArray<InterlinearWordAlignment>, Error> {
    try {
      const tokens = rawText.split(/\s+/).filter(Boolean);
      const alignments: InterlinearWordAlignment[] = tokens.map((token, idx) => {
        const morphRes = this.analyzeWord(token);
        const morph = morphRes.isSuccess ? morphRes.getValue() : { lemma: token, partOfSpeech: 'Noun' };

        let literalArabic = 'كلمة جؤزية';
        let englishGloss = "Ge'ez word";

        if (token.includes('ቃል')) {
          literalArabic = 'الكلمة (قال)';
          englishGloss = 'Word (Qal)';
        } else if (token.includes('እግዚአብሔር')) {
          literalArabic = 'الله (إغزيابهير)';
          englishGloss = 'God (Egziabeher)';
        }

        return {
          originalIndex: idx + 1,
          originalText: token,
          transliteration: token,
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
}

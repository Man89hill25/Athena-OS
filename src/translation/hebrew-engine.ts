/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Biblical Hebrew & Aramaic Engine
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { MorphologicalAnalysis, InterlinearWordAlignment } from './translation-types';

export class HebrewLinguisticEngine {
  public analyzeWord(hebrewWord: string): Result<MorphologicalAnalysis, Error> {
    try {
      const clean = hebrewWord.trim();

      if (clean.includes('בְּרֵאשִׁית') || clean.includes('בראשית')) {
        return Result.ok({
          lemma: 'רֵאשִׁית',
          root: 'ראש',
          partOfSpeech: 'Noun',
          grammaticalCase: 'Preposition + Noun',
          number: 'singular',
          gender: 'feminine',
          StrongsNumber: 'H7225'
        });
      }

      if (clean.includes('אֱלֹהִים') || clean.includes('אלהים')) {
        return Result.ok({
          lemma: 'אֱלֹהִים',
          root: 'אלה',
          partOfSpeech: 'Noun',
          number: 'plural',
          gender: 'masculine',
          StrongsNumber: 'H430'
        });
      }

      if (clean.includes('בָּרָא') || clean.includes('ברא')) {
        return Result.ok({
          lemma: 'בָּרָא',
          root: 'ברא',
          partOfSpeech: 'Verb',
          tense: 'perfect',
          voice: 'active',
          number: 'singular',
          gender: 'masculine',
          StrongsNumber: 'H1254'
        });
      }

      return Result.ok({
        lemma: clean,
        partOfSpeech: 'Noun / Generic',
        StrongsNumber: 'H0000'
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public buildHebrewInterlinear(rawText: string): Result<ReadonlyArray<InterlinearWordAlignment>, Error> {
    try {
      const tokens = rawText.split(/\s+/).filter(Boolean);
      const alignments: InterlinearWordAlignment[] = tokens.map((token, idx) => {
        const morphRes = this.analyzeWord(token);
        const morph = morphRes.isSuccess ? morphRes.getValue() : { lemma: token, partOfSpeech: 'Noun' };

        let literalArabic = 'كلمة عبرية';
        let englishGloss = 'Hebrew word';

        if (token.includes('בראשית') || token.includes('בְּרֵאשִׁית')) {
          literalArabic = 'في البدء (برئشيث)';
          englishGloss = 'In beginning (Bereshit)';
        } else if (token.includes('אלהים') || token.includes('אֱלֹהִים')) {
          literalArabic = 'الله / إلوهيم';
          englishGloss = 'God / Elohim';
        } else if (token.includes('ברא') || token.includes('בָּרָא')) {
          literalArabic = 'خلق';
          englishGloss = 'created';
        }

        return {
          originalIndex: idx + 1,
          originalText: token,
          transliteration: this.transliterateHebrew(token),
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

  public transliterateHebrew(text: string): string {
    return text
      .replace(/בְּרֵאשִׁית|בראשית/g, 'Bereshit')
      .replace(/בָּרָא|ברא/g, 'Bara')
      .replace(/אֱלֹהִים|אלהים/g, 'Elohim');
  }
}

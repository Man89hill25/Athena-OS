/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Unified Morphology, Lemmatization & Root Extraction Engine
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AncientLanguageCode, MorphologicalAnalysis } from './translation-types';
import { GreekLinguisticEngine } from './greek-engine';
import { CopticLinguisticEngine } from './coptic-engine';
import { SyriacLinguisticEngine } from './syriac-engine';
import { HebrewLinguisticEngine } from './hebrew-engine';
import { LatinLinguisticEngine } from './latin-engine';
import { ArabicLinguisticEngine } from './arabic-engine';

export class UnifiedMorphologyEngine {
  private greekEngine = new GreekLinguisticEngine();
  private copticEngine = new CopticLinguisticEngine();
  private syriacEngine = new SyriacLinguisticEngine();
  private hebrewEngine = new HebrewLinguisticEngine();
  private latinEngine = new LatinLinguisticEngine();
  private arabicEngine = new ArabicLinguisticEngine();

  public parseWordMorphology(
    word: string,
    language: AncientLanguageCode
  ): Result<MorphologicalAnalysis, Error> {
    switch (language) {
      case 'grc':
        return this.greekEngine.analyzeWord(word);
      case 'cop':
        return this.copticEngine.analyzeWord(word);
      case 'syr':
        return this.syriacEngine.analyzeWord(word);
      case 'heb':
      case 'arc':
        return this.hebrewEngine.analyzeWord(word);
      case 'lat':
        return this.latinEngine.analyzeWord(word);
      case 'ara':
        return this.arabicEngine.analyzeWord(word);
      default:
        return Result.ok({
          lemma: word,
          partOfSpeech: 'Generic'
        });
    }
  }
}

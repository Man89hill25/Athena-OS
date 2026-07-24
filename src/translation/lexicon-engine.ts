/**
 * ==========================================================================================================
 * ATHENA X - TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE
 * Module: Ancient Languages Specialized Lexicon Engine (Church Fathers, Biblical, Coptic, Greek, Hebrew, Syriac, Latin)
 * 
 * Directive: DIRECTIVE 213 — ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LexiconEntry, AncientLanguageCode } from './translation-types';
import { DictionaryEngine } from './dictionary-engine';

export class SpecializedLexiconEngine {
  private baseDictionary: DictionaryEngine;

  constructor(baseDictionary?: DictionaryEngine) {
    this.baseDictionary = baseDictionary || new DictionaryEngine();
  }

  public getChurchFathersTerm(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word);
  }

  public getBiblicalGreekLexicon(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word, 'grc');
  }

  public getCopticLexicon(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word, 'cop');
  }

  public getSyriacLexicon(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word, 'syr');
  }

  public getHebrewLexicon(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word, 'heb');
  }

  public getLatinLexicon(word: string): Result<LexiconEntry | undefined, Error> {
    return this.baseDictionary.lookupWord(word, 'lat');
  }
}

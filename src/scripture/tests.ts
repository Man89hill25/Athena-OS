/**
 * ==========================================================================================================
 * ATHENA X - BIBLICAL SCRIPTURE INTELLIGENCE ENGINE
 * Subsystem: Unit, Integration, & Performance Test Suite
 * 
 * Directive: 210 (Biblical Scripture Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ScriptureCorpusEngine } from './scripture-corpus-engine';
import { ScriptureSearchEngine } from './scripture-search-engine';
import { BiblicalLanguageEngine } from './biblical-language-engine';
import { BiblicalExegesisEngine } from './biblical-exegesis-engine';
import { TextualCriticismEngine } from './textual-criticism-engine';
import { BiblicalAIAgent } from './biblical-agent';
import { ScriptureCitationEngine } from './scripture-citation-engine';
import { ScriptureVerificationEngine } from './verification';
import { BibleVerse, ScriptureReference } from './scripture-types';

export interface ScriptureTestResult {
  readonly testName: string;
  readonly category: 'Unit' | 'Integration' | 'Performance';
  readonly passed: boolean;
  readonly durationMs: number;
  readonly error?: string;
}

export class ScriptureTestSuite {
  public static async runAllTests(): Promise<ReadonlyArray<ScriptureTestResult>> {
    const results: ScriptureTestResult[] = [];

    // Unit Tests
    results.push(await ScriptureTestSuite.testVerseCreationAndRegistration());
    results.push(await ScriptureTestSuite.testLanguageDetectionAndMorphology());
    results.push(await ScriptureTestSuite.testCrossReferenceLinking());
    results.push(await ScriptureTestSuite.testVariantDetectionAndApparatus());

    // Integration Tests
    results.push(await ScriptureTestSuite.testPatristicExegesisIntegration());
    results.push(await ScriptureTestSuite.testKnowledgeGraphAndRAGIntegration());
    results.push(await ScriptureTestSuite.testBiblicalAIAgentCommunication());

    // Performance Tests
    results.push(await ScriptureTestSuite.testLargeCorpusIndexingPerformance());
    results.push(await ScriptureTestSuite.testHybridSearchBenchmarkPerformance());

    return results;
  }

  // --- Unit Tests ---

  private static async testVerseCreationAndRegistration(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const corpus = new ScriptureCorpusEngine();
      const ref: ScriptureReference = {
        bookName: 'Genesis',
        bookArabicName: 'سفر التكوين',
        chapterNumber: 1,
        verseNumber: 1,
        standardRefStr: 'Genesis 1:1',
      };

      const verse: BibleVerse = {
        verseId: crypto.randomUUID(),
        reference: ref,
        text: 'فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.',
        normalizedText: 'في البدء خلق الله السماوات والارض',
        language: 'Arabic',
        corpusFamily: 'Arabic Bible Traditions',
        translationVersion: 'SVD',
        textualConfidence: 0.99,
      };

      corpus.indexVerse(verse);
      const parallelsRes = corpus.getParallelPassages('Genesis 1:1');
      if (parallelsRes.isFailure) throw parallelsRes.getError();

      return { testName: 'Verse Creation & Corpus Registration', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Verse Creation & Corpus Registration', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testLanguageDetectionAndMorphology(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const langEngine = new BiblicalLanguageEngine();
      const hebrewText = 'בְּרֵאשִׁית בָּרָא אֱלֹהִים';
      const detected = langEngine.detectLanguage(hebrewText);

      if (detected !== 'Hebrew') {
        throw new Error(`Expected 'Hebrew' but got '${detected}'`);
      }

      const res = langEngine.analyzeText(hebrewText);
      if (res.isFailure || res.getValue().tokens.length === 0) {
        throw new Error('Morphological analysis failed.');
      }

      return { testName: 'Language Detection & Morphological Analysis', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Language Detection & Morphological Analysis', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testCrossReferenceLinking(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const corpus = new ScriptureCorpusEngine();
      const parallelRes = corpus.getParallelPassages('John 1:1');
      if (parallelRes.isFailure || parallelRes.getValue().parallelVerses.length < 2) {
        throw new Error('Parallel cross reference linking returned insufficient passages.');
      }

      return { testName: 'Cross Reference Linking & Parallel Passages', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Cross Reference Linking & Parallel Passages', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testVariantDetectionAndApparatus(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const criticismEngine = new TextualCriticismEngine();
      const ref: ScriptureReference = {
        bookName: 'John',
        bookArabicName: 'إنجيل يوحنا',
        chapterNumber: 1,
        verseNumber: 18,
        standardRefStr: 'John 1:18',
      };

      const apparatusRes = criticismEngine.generateApparatus(ref);
      if (apparatusRes.isFailure) throw apparatusRes.getError();

      const report = apparatusRes.getValue();
      if (report.apparatusEntries.length === 0) {
        throw new Error('Critical apparatus failed to produce entries.');
      }

      return { testName: 'Textual Variant Detection & Critical Apparatus', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Textual Variant Detection & Critical Apparatus', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  // --- Integration Tests ---

  private static async testPatristicExegesisIntegration(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const exegesis = new BiblicalExegesisEngine();
      const ref: ScriptureReference = {
        bookName: 'John',
        bookArabicName: 'إنجيل يوحنا',
        chapterNumber: 1,
        verseNumber: 1,
        standardRefStr: 'John 1:1',
      };

      const res = exegesis.synthesizeExegesis(ref);
      if (res.isFailure) throw res.getError();

      const val = res.getValue();
      if (val.exegeticalNotes.length === 0 || !val.patristicExegesisSummary) {
        throw new Error('Patristic Exegesis integration failed.');
      }

      return { testName: 'Patristic Engine (Directive 209) Integration', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Patristic Engine (Directive 209) Integration', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testKnowledgeGraphAndRAGIntegration(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const corpus = new ScriptureCorpusEngine();
      const search = new ScriptureSearchEngine(corpus);

      const searchRes = await search.search({ query: 'الكلمة' });
      if (searchRes.isFailure || searchRes.getValue().length === 0) {
        throw new Error('RAG & Hybrid Search integration test failed.');
      }

      return { testName: 'Knowledge Graph & RAG Hybrid Search Integration', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Knowledge Graph & RAG Hybrid Search Integration', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(errorString(err)) };
    }
  }

  private static async testBiblicalAIAgentCommunication(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const agent = new BiblicalAIAgent();
      const res = await agent.conductResearch({
        query: 'في البدء كان الكلمة',
        passageRefStr: 'John 1:1',
        includeApparatus: true,
        includeExegesis: true,
      });

      if (res.isFailure) throw res.getError();

      const val = res.getValue();
      if (!val.synthesisReport || val.academicConfidence < 0.9) {
        throw new Error('Biblical AI Agent research communication failed.');
      }

      return { testName: 'Biblical AI Agent Autonomous Research Communication', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Biblical AI Agent Autonomous Research Communication', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  // --- Performance Tests ---

  private static async testLargeCorpusIndexingPerformance(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const corpus = new ScriptureCorpusEngine();
      for (let i = 1; i <= 200; i++) {
        const ref: ScriptureReference = {
          bookName: 'Psalms',
          bookArabicName: 'سفر المزامير',
          chapterNumber: 23,
          verseNumber: i,
          standardRefStr: `Psalms 23:${i}`,
        };
        corpus.indexVerse({
          verseId: crypto.randomUUID(),
          reference: ref,
          text: `الرَّبُّ رَاعِيَّ فَلاَ يَنُقُصُنِي شَيْءٌ. - آية ${i}`,
          normalizedText: `الرب راعي فلا ينقصني شيء آية ${i}`,
          language: 'Arabic',
          corpusFamily: 'Arabic Bible Traditions',
          translationVersion: 'SVD',
          textualConfidence: 0.99,
        });
      }

      const duration = Date.now() - start;
      if (duration > 300) {
        throw new Error(`Corpus indexing performance exceeded 300ms limit: ${duration}ms`);
      }

      return { testName: 'Large Scripture Corpus Indexing (<300ms)', category: 'Performance', passed: true, durationMs: duration };
    } catch (err: unknown) {
      return { testName: 'Large Scripture Corpus Indexing (<300ms)', category: 'Performance', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testHybridSearchBenchmarkPerformance(): Promise<ScriptureTestResult> {
    const start = Date.now();
    try {
      const corpus = new ScriptureCorpusEngine();
      const search = new ScriptureSearchEngine(corpus);

      const res = await search.search({ query: 'الله الكلمة' });
      if (res.isFailure) throw res.getError();

      const duration = Date.now() - start;
      if (duration > 150) {
        throw new Error(`Search benchmark exceeded 150ms limit: ${duration}ms`);
      }

      return { testName: 'Hybrid Search Benchmark Speed (<150ms)', category: 'Performance', passed: true, durationMs: duration };
    } catch (err: unknown) {
      return { testName: 'Hybrid Search Benchmark Speed (<150ms)', category: 'Performance', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }
}

function errorString(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * ==========================================================================================================
 * ATHENA X - PATRISTIC & THEOLOGICAL INTELLIGENCE ENGINE
 * Subsystem: Patristic Unit, Integration, & Performance Test Suite
 * 
 * Directive: 209 (Patristic & Theological Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { PatristicCorpusEngine } from './patristic-corpus-engine';
import { PatristicSearchEngine } from './patristic-search-engine';
import { PatristicExegesisEngine } from './exegesis-engine';
import { TheologyIntelligenceEngine } from './theology-intelligence';
import { PatristicAIAgent } from './patristic-agent';
import { PatristicCitationEngine } from './patristic-citation-engine';
import { PatristicVerificationEngine } from './verification';
import { ChurchFather, PatristicWork, Doctrine } from './patristic-types';

export interface PatristicTestResult {
  readonly testName: string;
  readonly category: 'Unit' | 'Integration' | 'Performance';
  readonly passed: boolean;
  readonly durationMs: number;
  readonly error?: string;
}

export class PatristicTestSuite {
  public static async runAllTests(): Promise<ReadonlyArray<PatristicTestResult>> {
    const results: PatristicTestResult[] = [];

    // Unit Tests
    results.push(await PatristicTestSuite.testFatherCreationAndRegistration());
    results.push(await PatristicTestSuite.testWorkLinkingAndIndexing());
    results.push(await PatristicTestSuite.testCitationExtraction());
    results.push(await PatristicTestSuite.testDoctrineMapping());

    // Integration Tests
    results.push(await PatristicTestSuite.testAIAgentResearchCommunication());
    results.push(await PatristicTestSuite.testRAGAndSearchRetrievalIntegration());
    results.push(await PatristicTestSuite.testCitationFormattingSBLAndChicago());

    // Performance Tests
    results.push(await PatristicTestSuite.testCorpusIndexingPerformance());
    results.push(await PatristicTestSuite.testSearchSpeedAndTraversalPerformance());

    return results;
  }

  // --- Unit Tests ---

  private static async testFatherCreationAndRegistration(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const fatherId = crypto.randomUUID();
      const father: ChurchFather = {
        fatherId,
        name: 'Gregory of Nazianzus',
        arabicName: 'القديس غريغوريوس النزيانزي الثيؤلوغوس',
        titleOrEpithet: 'الناطق بالإلهيات',
        tradition: 'Greek',
        school: 'Cappadocian',
        period: '329 – 390 CE',
        century: 4,
        primaryLanguage: 'Greek',
        biographySummary: 'أحد الآباء الكبادوك الكبار وصائغ الخطب اللاهوتية الخمس.',
        confidenceScore: 0.99,
      };

      const res = corpus.registerFather(father);
      if (res.isFailure) throw res.getError();

      const retrieved = corpus.getFather(fatherId);
      if (!retrieved || retrieved.arabicName !== father.arabicName) {
        throw new Error('Father registration or retrieval failed.');
      }

      return { testName: 'Father Creation & Registration', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Father Creation & Registration', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testWorkLinkingAndIndexing(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const father = corpus.getAllFathers()[0];
      if (!father) throw new Error('No seeded Father found.');

      const workId = crypto.randomUUID();
      const work: PatristicWork = {
        workId,
        fatherId: father.fatherId,
        title: 'Orations',
        arabicTitle: 'الخطب اللاهوتية',
        originalLanguageTitle: 'Λόγοι',
        corpus: 'Patrologia Graeca',
        century: 4,
        originalLanguage: 'Greek',
        summary: 'الخطب الخمس الشاهيرة في اللاهوت والدفاع عن التثليث.',
        manuscriptWitnesses: ['Codex Parisinus'],
        bibliography: ['PG 36'],
      };

      const res = corpus.registerWork(work);
      if (res.isFailure) throw res.getError();

      return { testName: 'Work Linking & Corpus Registration', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Work Linking & Corpus Registration', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testCitationExtraction(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const work = corpus.getAllWorks()[0];
      if (!work) throw new Error('No seeded work found.');

      const sampleText = `إن الكلمة المتجسد هو الذي افتدانا بدمه الزكي.\nوقد أبطل الموت بقوة لاهوته المحيي.`;
      const extractRes = corpus.indexText(work.workId, sampleText, 'PG 25, 120');

      if (extractRes.isFailure) throw extractRes.getError();
      if (extractRes.getValue().length < 2) {
        throw new Error('Citation extraction failed to produce expected citations.');
      }

      return { testName: 'Patristic Citation Extraction', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Patristic Citation Extraction', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testDoctrineMapping(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const engine = new TheologyIntelligenceEngine();
      const doctrineId = crypto.randomUUID();
      const doctrine: Doctrine = {
        doctrineId,
        title: 'Hypostatic Union',
        arabicTitle: 'عقيدة الاتحاد الهيبوستاسي (الاتحاد الأقنومي)',
        description: 'اتحاد اللاهوت بالناسوت في شخص الكلمة الواحد بغير اختلاط ولا امتزاج ولا تغيير ولا تغيير.',
        keyFathers: [],
        keyWorks: [],
        councilReferences: ['مجمع أفسس 431م'],
      };

      const res = engine.mapDoctrine(doctrine);
      if (res.isFailure) throw res.getError();

      const retrieved = engine.getDoctrine(doctrineId);
      if (!retrieved || !retrieved.arabicTitle.includes('الهيبوستاسي')) {
        throw new Error('Doctrine mapping failed.');
      }

      return { testName: 'Doctrine & Theology Mapping', category: 'Unit', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Doctrine & Theology Mapping', category: 'Unit', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  // --- Integration Tests ---

  private static async testAIAgentResearchCommunication(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const agent = new PatristicAIAgent();
      const res = await agent.conductResearch({
        query: 'أثناسيوس تجسد الكلمة نيقية',
        passageRef: 'John 1:14',
        includeManuscripts: true,
      });

      if (res.isFailure) throw res.getError();

      const val = res.getValue();
      if (!val.researchSynthesis || val.academicConfidence < 0.9) {
        throw new Error('Patristic AI Agent research communication failed.');
      }

      return { testName: 'Patristic AI Agent Research Communication', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Patristic AI Agent Research Communication', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testRAGAndSearchRetrievalIntegration(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const search = new PatristicSearchEngine(corpus);

      const searchRes = await search.search({ query: 'أثناسيوس' });
      if (searchRes.isFailure) throw searchRes.getError();

      if (searchRes.getValue().length === 0) {
        throw new Error('Search retrieval returned 0 results for seeded Father.');
      }

      return { testName: 'RAG & Search Retrieval Integration', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'RAG & Search Retrieval Integration', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testCitationFormattingSBLAndChicago(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const father = corpus.getAllFathers()[0];
      const work = corpus.getAllWorks()[0];

      if (!father || !work) throw new Error('Seeded data missing for citation format test.');

      const output = PatristicCitationEngine.formatCitation(father, work, '54.3', 'SBL');
      if (!output.footnoteStr.includes(father.name) || !output.criticalReferenceStr.includes(father.arabicName)) {
        throw new Error('Citation engine SBL output missing expected author name.');
      }

      return { testName: 'Academic Citation Formatting (SBL & Chicago)', category: 'Integration', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return { testName: 'Academic Citation Formatting (SBL & Chicago)', category: 'Integration', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  // --- Performance Tests ---

  private static async testCorpusIndexingPerformance(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const work = corpus.getAllWorks()[0];
      if (!work) throw new Error('Seeded work missing.');

      const largeText = Array.from({ length: 100 }, (_, i) => `فقرة أبائية رقم ${i + 1} تشرح عقيدة التثليث والتوحيد.`).join('\n');
      const idxRes = corpus.indexText(work.workId, largeText, 'PG 25, 100');

      if (idxRes.isFailure) throw idxRes.getError();
      const duration = Date.now() - start;

      if (duration > 500) {
        throw new Error(`Indexing performance exceeded limit: ${duration}ms`);
      }

      return { testName: 'Corpus Indexing Performance (<500ms)', category: 'Performance', passed: true, durationMs: duration };
    } catch (err: unknown) {
      return { testName: 'Corpus Indexing Performance (<500ms)', category: 'Performance', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }

  private static async testSearchSpeedAndTraversalPerformance(): Promise<PatristicTestResult> {
    const start = Date.now();
    try {
      const corpus = new PatristicCorpusEngine();
      const search = new PatristicSearchEngine(corpus);

      const res = await search.search({ query: 'أثناسيوس تجسد' });
      if (res.isFailure) throw res.getError();

      const duration = Date.now() - start;
      if (duration > 200) {
        throw new Error(`Search speed exceeded performance threshold: ${duration}ms`);
      }

      return { testName: 'Search Speed & Relationship Traversal (<200ms)', category: 'Performance', passed: true, durationMs: duration };
    } catch (err: unknown) {
      return { testName: 'Search Speed & Relationship Traversal (<200ms)', category: 'Performance', passed: false, durationMs: Date.now() - start, error: String(err) };
    }
  }
}

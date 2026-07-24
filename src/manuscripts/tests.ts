/**
 * ==========================================================================================================
 * ATHENA X - MANUSCRIPT INTELLIGENCE PLATFORM
 * Subsystem: Manuscript Intelligence Unit & Integration Tests
 * 
 * Directive: 208 (Manuscript Intelligence Platform)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { OCRPipeline } from './ocr-pipeline';
import { HTREngine } from './htr-engine';
import { PaleographyEngine } from './paleography-engine';
import { TextualVariantEngine } from './textual-variant-engine';
import { TEIExporter } from './tei-exporter';
import { ManuscriptMetadata, FolioPage } from './manuscript-types';

export interface ManuscriptTestResult {
  readonly testName: string;
  readonly passed: boolean;
  readonly durationMs: number;
  readonly error?: string;
}

export class ManuscriptTestSuite {
  public static async runAllTests(): Promise<ReadonlyArray<ManuscriptTestResult>> {
    const results: ManuscriptTestResult[] = [];

    results.push(await ManuscriptTestSuite.testOCRPipelineAndPostCorrection());
    results.push(await ManuscriptTestSuite.testHTREngineMultiLanguage());
    results.push(await ManuscriptTestSuite.testPaleographyScriptDating());
    results.push(await ManuscriptTestSuite.testTextualVariantAndApparatus());
    results.push(await ManuscriptTestSuite.testTEIXMLExporter());

    return results;
  }

  private static async testOCRPipelineAndPostCorrection(): Promise<ManuscriptTestResult> {
    const start = Date.now();
    try {
      const pipeline = new OCRPipeline('GeminiVisionAdapter');
      const res = await pipeline.processFolio('ms_001', 'Folio 1r', 'sample_image_data', 'Greek');

      if (res.isFailure) throw res.getError();

      const output = res.getValue();
      if (!output.correctedText || output.regions.length === 0 || output.overallConfidence <= 0) {
        throw new Error('OCR pipeline failed to process regions or post-correct output.');
      }

      return { testName: 'OCR Pipeline & Post-Correction', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return {
        testName: 'OCR Pipeline & Post-Correction',
        passed: false,
        durationMs: Date.now() - start,
        error: String(err),
      };
    }
  }

  private static async testHTREngineMultiLanguage(): Promise<ManuscriptTestResult> {
    const start = Date.now();
    try {
      const htr = new HTREngine();
      const resCoptic = await htr.transcribeHandwriting('ms_cop_1', 'Folio 2r', 'img_uri', {
        language: 'Coptic',
        enableLigatureModel: true,
        charConfidenceThreshold: 0.8,
      });

      if (resCoptic.isFailure) throw resCoptic.getError();

      const val = resCoptic.getValue();
      if (!val.transcribedText || val.overallAccuracy < 0.8) {
        throw new Error('HTR engine failed transcription or returned accuracy below threshold.');
      }

      return { testName: 'HTR Engine Multi-Language', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return {
        testName: 'HTR Engine Multi-Language',
        passed: false,
        durationMs: Date.now() - start,
        error: String(err),
      };
    }
  }

  private static async testPaleographyScriptDating(): Promise<ManuscriptTestResult> {
    const start = Date.now();
    try {
      const res = PaleographyEngine.analyzePaleography(
        'codex_sinaiticus_01',
        'Folio 12v',
        'Greek',
        'ΕΝ ΑΡΧΗΗΝ Ο ΛΟΓΟΣ'
      );

      if (res.isFailure) throw res.getError();

      const val = res.getValue();
      if (val.identifiedScript !== 'Uncial' || val.estimatedDating.startYearCE !== 325) {
        throw new Error(`Paleography identification mismatch: got ${val.identifiedScript}`);
      }

      return { testName: 'Paleography Script Classification & Dating', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return {
        testName: 'Paleography Script Classification & Dating',
        passed: false,
        durationMs: Date.now() - start,
        error: String(err),
      };
    }
  }

  private static async testTextualVariantAndApparatus(): Promise<ManuscriptTestResult> {
    const start = Date.now();
    try {
      const baseText = 'في البدء كان الكلمة';
      const witnesses = [
        {
          shelfmark: 'MS Copt 12',
          manuscriptTitle: 'مخطوط الصعيد القديم',
          text: 'في البدء كان [كلمة]',
        },
      ];

      const res = TextualVariantEngine.compareWitnesses('John 1:1', baseText, witnesses);
      if (res.isFailure) throw res.getError();

      const val = res.getValue();
      if (val.variants.length === 0 || val.apparatusEntries.length === 0) {
        throw new Error('Textual variant engine failed to detect variants.');
      }

      const formatted = TextualVariantEngine.formatCriticalApparatus(val.apparatusEntries);
      if (!formatted.includes('CRITICAL APPARATUS')) {
        throw new Error('Apparatus formatting header missing.');
      }

      return { testName: 'Textual Variant Analysis & Apparatus', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return {
        testName: 'Textual Variant Analysis & Apparatus',
        passed: false,
        durationMs: Date.now() - start,
        error: String(err),
      };
    }
  }

  private static async testTEIXMLExporter(): Promise<ManuscriptTestResult> {
    const start = Date.now();
    try {
      const metadata: ManuscriptMetadata = {
        manuscriptId: crypto.randomUUID(),
        title: 'كودكس سيناء الأرثوذكسي',
        format: 'Codex',
        repository: {
          name: 'المكتبة البريطانية',
          city: 'لندن',
          country: 'المملكة المتحدة',
        },
        shelfmark: 'Add MS 43725',
        estimatedDate: 'حوالي 330-360م',
        dateCentury: 4,
        primaryLanguage: 'Greek',
        scriptType: 'Uncial',
        provenance: {
          scribeName: 'Scribe A',
          historicalOwners: ['دير القديسة كاترين'],
          century: 4,
        },
        folioCount: 346,
        isDigitized: true,
        digitalImageUris: ['https://example.org/folio1r.jpg'],
        createdAt: new Date().toISOString() as any,
      };

      const folios: FolioPage[] = [
        {
          folioId: crypto.randomUUID(),
          manuscriptId: metadata.manuscriptId,
          folioNumber: 'Folio 1r',
          imageUri: 'https://example.org/folio1r.jpg',
          dimensionsPixels: { width: 2000, height: 3000 },
          transcribeText: 'ΕΝ ΑΡΧΗΗΝ Ο ΛΟΓΟΣ',
          confidenceScore: 0.98,
        },
      ];

      const xml = TEIExporter.exportToTEIXML(metadata, folios);
      if (!xml.includes('<TEI') || !xml.includes('Add MS 43725')) {
        throw new Error('TEI XML Exporter generated invalid XML markup.');
      }

      return { testName: 'TEI XML Export Compliance', passed: true, durationMs: Date.now() - start };
    } catch (err: unknown) {
      return {
        testName: 'TEI XML Export Compliance',
        passed: false,
        durationMs: Date.now() - start,
        error: String(err),
      };
    }
  }
}

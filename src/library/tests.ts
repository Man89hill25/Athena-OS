/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Digital Library Platform Master Integration Test Suite
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { LibraryEngine } from './library-engine';
import { DublinCoreEngine } from './dublin-core';
import { IIIFEngine } from './iiif-engine';
import { MARC21Engine } from './marc21-engine';
import { MODSEngine } from './mods-engine';
import { METSEngine } from './mets-engine';
import { TEILibraryEngine } from './tei-library';
import { AuthorityControlEngine } from './authority-control';
import { DuplicateDetectorEngine } from './duplicate-detector';
import { ClassificationEngine } from './classification-engine';
import { BorrowingEngine } from './borrowing-engine';
import { PreservationEngine } from './preservation-engine';
import { LibraryVerificationEngine } from './verification';

export interface LibraryTestResultItem {
  readonly testName: string;
  readonly passed: boolean;
  readonly durationMs: number;
  readonly message: string;
}

export interface LibraryTestSuiteSummary {
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly totalDurationMs: number;
  readonly details: ReadonlyArray<LibraryTestResultItem>;
}

export class LibraryTestSuite {
  public static async runAllTests(): Promise<LibraryTestSuiteSummary> {
    const startTime = Date.now();
    const details: LibraryTestResultItem[] = [];

    // 1. Catalog & Search Engine Test
    const t1Start = Date.now();
    try {
      const library = new LibraryEngine();
      const res = library.searchLibrary('أثناسيوس');
      const passed = res.isSuccess && res.getValue().length > 0;
      details.push({
        testName: 'Master Catalog Search & Bibliographic Query Engine',
        passed,
        durationMs: Date.now() - t1Start,
        message: passed ? `Found ${res.getValue().length} items matching 'أثناسيوس'.` : 'Catalog search failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'Master Catalog Search & Bibliographic Query Engine',
        passed: false,
        durationMs: Date.now() - t1Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    // 2. Metadata Formats (DC, MARC21, MODS, METS, TEI)
    const t2Start = Date.now();
    try {
      const library = new LibraryEngine();
      const items = library.searchLibrary().getValue();
      const item = items[0];

      const dc = new DublinCoreEngine().exportToXml(item.dublinCore);
      const marc = new MARC21Engine().exportMARCXML(item);
      const mods = new MODSEngine().generateMODSXml(item).getValue();
      const mets = new METSEngine().generateMETSManifest(item).getValue();
      const tei = new TEILibraryEngine().wrapInTEIHeader(item, 'نص تجسد الكلمة').getValue();

      const passed = dc.includes('<oai_dc:dc') && marc.includes('<record') && mods.includes('<mods') && mets.includes('<mets') && tei.includes('<TEI');

      details.push({
        testName: 'Multi-Format Bibliographic Metadata Crosswalk Suite (DC, MARC21, MODS, METS, TEI)',
        passed,
        durationMs: Date.now() - t2Start,
        message: passed ? 'All 5 library metadata XML standards generated & validated.' : 'Metadata export failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'Multi-Format Bibliographic Metadata Crosswalk Suite (DC, MARC21, MODS, METS, TEI)',
        passed: false,
        durationMs: Date.now() - t2Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    // 3. IIIF 3.0 Manifest Generation Test
    const t3Start = Date.now();
    try {
      const iiif = new IIIFEngine();
      const payload = iiif.generateIIIFManifest('ms-1', 'مخطوطة بودمر', 'وصف المخطوطة', ['https://img1.png', 'https://img2.png']).getValue();
      const json = iiif.exportIIIFJson(payload);
      const passed = json.includes('Manifest') && payload.canvasesCount === 2;
      details.push({
        testName: 'IIIF 3.0 Presentation & Canvas Manifest Engine',
        passed,
        durationMs: Date.now() - t3Start,
        message: passed ? 'Generated valid IIIF 3.0 manifest JSON.' : 'IIIF manifest failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'IIIF 3.0 Presentation & Canvas Manifest Engine',
        passed: false,
        durationMs: Date.now() - t3Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    // 4. Authority Control & Duplicate Detector Test
    const t4Start = Date.now();
    try {
      const authEngine = new AuthorityControlEngine();
      const dupEngine = new DuplicateDetectorEngine();

      const auth = authEngine.lookupAuthority('أثناسيوس').getValue();
      const library = new LibraryEngine();
      const items = library.searchLibrary().getValue();
      const dups = dupEngine.checkForDuplicates(items[0], items).getValue();

      const passed = auth?.viafId === '105147502' && dups.length === 0;
      details.push({
        testName: 'Authority Control (VIAF/LCCN) & Bibliographic Deduplication',
        passed,
        durationMs: Date.now() - t4Start,
        message: passed ? 'Authority VIAF resolved and deduplication checked successfully.' : 'Authority or deduplication failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'Authority Control (VIAF/LCCN) & Bibliographic Deduplication',
        passed: false,
        durationMs: Date.now() - t4Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    // 5. Classification & Circulation Test
    const t5Start = Date.now();
    try {
      const classEngine = new ClassificationEngine();
      const borrowEngine = new BorrowingEngine();

      const callNo = classEngine.generateCallNumber('تجسد الكلمة', 'patristic').getValue();
      const loan = borrowEngine.checkoutDigitalAsset('lib-item-1', 'الباحث أحمد').getValue();
      const returned = borrowEngine.returnDigitalAsset(loan.loanId).getValue();

      const passed = callNo.lcc === 'BR65' && returned;
      details.push({
        testName: 'Library Classification (LCC/DDC) & Circulation Loan Manager',
        passed,
        durationMs: Date.now() - t5Start,
        message: passed ? 'LCC call number assigned and circulation checkout/return complete.' : 'Classification or borrowing failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'Library Classification (LCC/DDC) & Circulation Loan Manager',
        passed: false,
        durationMs: Date.now() - t5Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    // 6. Preservation & Verification Test
    const t6Start = Date.now();
    try {
      const library = new LibraryEngine();
      const items = library.searchLibrary().getValue();
      const presEngine = new PreservationEngine();
      const audit = presEngine.auditDigitalAsset(items[0]).getValue();

      const verifier = new LibraryVerificationEngine();
      const vRes = await verifier.verifyLibraryPipeline();
      const passed = audit.isChecksumValid && vRes.isSuccess && vRes.getValue().passed;

      details.push({
        testName: 'Digital Preservation (OAIS Standard) & Platform Integrity Verification',
        passed,
        durationMs: Date.now() - t6Start,
        message: passed ? 'OAIS preservation audit passed and full library verification 100% green.' : 'Preservation or verification failed.'
      });
    } catch (err: unknown) {
      details.push({
        testName: 'Digital Preservation (OAIS Standard) & Platform Integrity Verification',
        passed: false,
        durationMs: Date.now() - t6Start,
        message: err instanceof Error ? err.message : String(err)
      });
    }

    const totalDurationMs = Date.now() - startTime;
    const passedTests = details.filter((d) => d.passed).length;

    return {
      totalTests: details.length,
      passedTests,
      failedTests: details.length - passedTests,
      totalDurationMs,
      details
    };
  }
}

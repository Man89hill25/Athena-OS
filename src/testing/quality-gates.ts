/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Enterprise CI Quality Gates Evaluator
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { QualityGateEvaluation, CoverageReport, MutationTestingReport, TestSuiteResult } from './testing-types';

export class QualityGatesEvaluator {
  public evaluateQualityGate(
    coverage: CoverageReport,
    mutation: MutationTestingReport,
    suiteResults: ReadonlyArray<TestSuiteResult>
  ): Result<QualityGateEvaluation, Error> {
    try {
      const minCoverageRequiredPercent = 90;
      const minMutationScorePercent = 85;
      const maxAllowedFailuresCount = 0;

      let actualFailuresCount = 0;
      for (const suite of suiteResults) {
        actualFailuresCount += suite.failedCount;
      }

      const passed =
        coverage.lineCoveragePercent >= minCoverageRequiredPercent &&
        mutation.mutationScorePercent >= minMutationScorePercent &&
        actualFailuresCount <= maxAllowedFailuresCount;

      return Result.ok({
        passed,
        minCoverageRequiredPercent,
        actualCoveragePercent: coverage.lineCoveragePercent,
        minMutationScorePercent,
        actualMutationScorePercent: mutation.mutationScorePercent,
        maxAllowedFailuresCount,
        actualFailuresCount,
        statusMessageArabic: passed
          ? 'بوابة الجودة الأكاديمية اجتازت جميع الشروط والمعايير العالية'
          : 'فشل في اجتياز بوابة الجودة الأكاديمية'
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

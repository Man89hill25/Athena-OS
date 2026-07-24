/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Unified Test Runner Orchestrator
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { TestSuiteResult, TestCaseResult, TestType } from './testing-types';

export class TestRunner {
  private executedSuites: TestSuiteResult[] = [];

  public async runSuite(
    suiteNameArabic: string,
    testFns: Array<{ nameArabic: string; type: TestType; fn: () => Promise<void> | void }>
  ): Promise<Result<TestSuiteResult, Error>> {
    const start = performance.now();
    const testResults: TestCaseResult[] = [];
    let passedCount = 0;
    let failedCount = 0;

    for (const testItem of testFns) {
      const testStart = performance.now();
      try {
        await testItem.fn();
        const durationMs = performance.now() - testStart;
        testResults.push({
          testId: `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          testNameArabic: testItem.nameArabic,
          testType: testItem.type,
          status: 'passed',
          durationMs
        });
        passedCount++;
      } catch (err: unknown) {
        const durationMs = performance.now() - testStart;
        const errorMessage = err instanceof Error ? err.message : String(err);
        testResults.push({
          testId: `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          testNameArabic: testItem.nameArabic,
          testType: testItem.type,
          status: 'failed',
          durationMs,
          errorMessage
        });
        failedCount++;
      }
    }

    const totalDurationMs = performance.now() - start;
    const suiteResult: TestSuiteResult = {
      suiteId: `suite-${Date.now()}`,
      suiteNameArabic,
      totalTestsCount: testFns.length,
      passedCount,
      failedCount,
      skippedCount: 0,
      durationMs: totalDurationMs,
      testResults
    };

    this.executedSuites.push(suiteResult);
    return Result.ok(suiteResult);
  }

  public getExecutedSuites(): ReadonlyArray<TestSuiteResult> {
    return this.executedSuites;
  }
}

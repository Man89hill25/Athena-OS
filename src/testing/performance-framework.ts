/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Performance & Latency Benchmark Framework
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { TestCaseResult } from './testing-types';

export class PerformanceTestingFramework {
  public async benchmarkOperation(
    testNameArabic: string,
    operationFn: () => void,
    maxAllowedMs = 50
  ): Promise<Result<TestCaseResult, Error>> {
    const start = performance.now();
    try {
      operationFn();
      const durationMs = performance.now() - start;
      const passed = durationMs <= maxAllowedMs;

      return Result.ok({
        testId: `perf-${Date.now()}`,
        testNameArabic,
        testType: 'performance',
        status: passed ? 'passed' : 'failed',
        durationMs,
        errorMessage: passed ? undefined : `تجاوز الزمن المسموح (${durationMs.toFixed(2)}ms > ${maxAllowedMs}ms)`
      });
    } catch (err: unknown) {
      return Result.ok({
        testId: `perf-${Date.now()}`,
        testNameArabic,
        testType: 'performance',
        status: 'failed',
        durationMs: performance.now() - start,
        errorMessage: err instanceof Error ? err.message : String(err)
      });
    }
  }
}

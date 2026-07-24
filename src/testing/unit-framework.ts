/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Unit Testing Framework
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { TestCaseResult } from './testing-types';

export class UnitTestingFramework {
  public assertEqual<T>(actual: T, expected: T, messageArabic = 'القيم متطابقة'): Result<void, Error> {
    if (actual === expected) {
      return Result.ok(undefined);
    }
    return Result.fail(new Error(`فشل الفحص: ${messageArabic} - القيمة المتوقعة: ${expected}، القيمة الفعلية: ${actual}`));
  }

  public assertTrue(condition: boolean, messageArabic = 'الشرط صحيح'): Result<void, Error> {
    if (condition) {
      return Result.ok(undefined);
    }
    return Result.fail(new Error(`فشل الفحص: ${messageArabic}`));
  }

  public runUnitTest(testNameArabic: string, unitFn: () => void): Result<TestCaseResult, Error> {
    const start = performance.now();
    try {
      unitFn();
      return Result.ok({
        testId: `unit-${Date.now()}`,
        testNameArabic,
        testType: 'unit',
        status: 'passed',
        durationMs: performance.now() - start
      });
    } catch (err: unknown) {
      return Result.ok({
        testId: `unit-${Date.now()}`,
        testNameArabic,
        testType: 'unit',
        status: 'failed',
        durationMs: performance.now() - start,
        errorMessage: err instanceof Error ? err.message : String(err)
      });
    }
  }
}

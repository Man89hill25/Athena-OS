/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Testing Types & Domain Models
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type TestType =
  | 'unit'
  | 'integration'
  | 'system'
  | 'e2e'
  | 'performance'
  | 'stress'
  | 'load'
  | 'chaos'
  | 'security'
  | 'regression'
  | 'compatibility'
  | 'snapshot'
  | 'golden_master'
  | 'mutation';

export type TestStatus = 'passed' | 'failed' | 'skipped' | 'running';

export interface TestCaseResult {
  readonly testId: UUID;
  readonly testNameArabic: string;
  readonly testType: TestType;
  readonly status: TestStatus;
  readonly durationMs: number;
  readonly errorMessage?: string;
  readonly stackTrace?: string;
}

export interface TestSuiteResult {
  readonly suiteId: UUID;
  readonly suiteNameArabic: string;
  readonly totalTestsCount: number;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly skippedCount: number;
  readonly durationMs: number;
  readonly testResults: ReadonlyArray<TestCaseResult>;
}

export interface CoverageReport {
  readonly statementCoveragePercent: number;
  readonly branchCoveragePercent: number;
  readonly functionCoveragePercent: number;
  readonly lineCoveragePercent: number;
  readonly totalLinesCount: number;
  readonly coveredLinesCount: number;
}

export interface MutationTestingReport {
  readonly mutantsCreatedCount: number;
  readonly mutantsKilledCount: number;
  readonly mutantsSurvivedCount: number;
  readonly mutationScorePercent: number;
}

export interface QualityGateEvaluation {
  readonly passed: boolean;
  readonly minCoverageRequiredPercent: number;
  readonly actualCoveragePercent: number;
  readonly minMutationScorePercent: number;
  readonly actualMutationScorePercent: number;
  readonly maxAllowedFailuresCount: number;
  readonly actualFailuresCount: number;
  readonly statusMessageArabic: string;
}

export interface TestingStatusState {
  readonly isSuiteRunning: boolean;
  readonly totalSuitesExecutedCount: number;
  readonly overallPassRatePercent: number;
  readonly codeCoveragePercent: number;
  readonly qualityGatePassed: boolean;
  readonly lastExecutionISO: ISO8601Timestamp;
}

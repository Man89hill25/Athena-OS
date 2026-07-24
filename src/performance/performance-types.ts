/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Performance Domain Types & Metrics Specifications
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ISO8601Timestamp } from '../foundation';

export interface MemoryMetrics {
  readonly heapUsedMB: number;
  readonly heapTotalMB: number;
  readonly rssMB: number;
  readonly externalMB: number;
}

export interface CpuMetrics {
  readonly userCpuUsagePercent: number;
  readonly systemCpuUsagePercent: number;
  readonly activeCoreCount: number;
}

export interface CacheStatistics {
  readonly cacheHitsCount: number;
  readonly cacheMissesCount: number;
  readonly hitRatioPercent: number;
  readonly activeCachedEntriesCount: number;
}

export interface PerformanceBenchmarkResult {
  readonly testNameArabic: string;
  readonly operationsPerSecond: number;
  readonly averageLatencyMs: number;
  readonly p99LatencyMs: number;
  readonly passedTargetBenchmark: boolean;
}

export interface PerformanceStatusState {
  readonly cacheEngineActive: boolean;
  readonly memoryOptimizerActive: boolean;
  readonly threadPoolActive: boolean;
  readonly gpuAccelerationAvailable: boolean;
  readonly overallSystemScorePercent: number;
  readonly timestamp: ISO8601Timestamp;
}

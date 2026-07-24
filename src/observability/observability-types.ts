/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: Observability Types & Telemetry Models
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface StructuredLogEntry {
  readonly logId: UUID;
  readonly timestampISO: ISO8601Timestamp;
  readonly level: LogLevel;
  readonly moduleName: string;
  readonly messageArabic: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface TraceSpan {
  readonly spanId: UUID;
  readonly traceId: UUID;
  readonly parentSpanId?: UUID;
  readonly operationNameArabic: string;
  readonly startTimeISO: ISO8601Timestamp;
  readonly durationMs: number;
  readonly tags: Record<string, string>;
  readonly status: 'ok' | 'error';
}

export interface MetricDataPoint {
  readonly metricName: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly timestampISO: ISO8601Timestamp;
}

export interface SystemAlert {
  readonly alertId: UUID;
  readonly severity: AlertSeverity;
  readonly titleArabic: string;
  readonly descriptionArabic: string;
  readonly triggeredAtISO: ISO8601Timestamp;
  readonly isResolved: boolean;
}

export interface AnomalyDetectionResult {
  readonly metricName: string;
  readonly isAnomalyDetected: boolean;
  readonly deviationScore: number;
  readonly explanationArabic: string;
}

export interface ObservabilityStatusState {
  readonly isExporterActive: boolean;
  readonly totalLogsIngestedCount: number;
  readonly activeTracesCount: number;
  readonly totalMetricsCollectedCount: number;
  readonly activeAlertsCount: number;
  readonly anomalyDetectionOperational: boolean;
  readonly timestampISO: ISO8601Timestamp;
}

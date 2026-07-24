/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: Prometheus Multi-Type Metrics Collection Engine
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { MetricType, MetricDataPoint } from './observability-types';

export class MetricsEngine {
  private metricsMap: Map<string, MetricDataPoint> = new Map();

  public recordMetric(
    metricName: string,
    type: MetricType,
    value: number,
    labels: Record<string, string> = {}
  ): Result<MetricDataPoint, Error> {
    try {
      const point: MetricDataPoint = {
        metricName,
        type,
        value,
        labels,
        timestampISO: new Date().toISOString()
      };
      this.metricsMap.set(metricName, point);
      return Result.ok(point);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getAllMetrics(): ReadonlyArray<MetricDataPoint> {
    return Array.from(this.metricsMap.values());
  }
}

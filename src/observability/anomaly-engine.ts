/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: Machine Learning Anomaly Detection Telemetry Engine
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AnomalyDetectionResult } from './observability-types';

export class AnomalyDetectionEngine {
  public analyzeMetricForAnomalies(
    metricName: string,
    timeSeriesValues: number[]
  ): Result<AnomalyDetectionResult, Error> {
    try {
      if (timeSeriesValues.length === 0) {
        return Result.ok({
          metricName,
          isAnomalyDetected: false,
          deviationScore: 0.0,
          explanationArabic: 'لا توجد بيانات كافية للكشف عن السلوك الشاذ'
        });
      }

      const avg = timeSeriesValues.reduce((a, b) => a + b, 0) / timeSeriesValues.length;
      const latest = timeSeriesValues[timeSeriesValues.length - 1];
      const diff = Math.abs(latest - avg);
      const isAnomalyDetected = diff > avg * 1.5;

      return Result.ok({
        metricName,
        isAnomalyDetected,
        deviationScore: diff,
        explanationArabic: isAnomalyDetected
          ? 'تم رصد انحراف ملحوظ عن المتوسط العام للمقاييس المحددة'
          : 'المقاييس تقع ضمن الحدود الطبيعية المقبولة'
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: OpenTelemetry Distributed Tracing Engine
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { TraceSpan } from './observability-types';

export class TracingEngine {
  private spans: TraceSpan[] = [];

  public startTraceSpan(
    operationNameArabic: string,
    tags: Record<string, string> = {}
  ): { spanId: string; traceId: string; endSpan: (status?: 'ok' | 'error') => Result<TraceSpan, Error> } {
    const spanId = `span-${Math.random().toString(36).slice(2, 8)}`;
    const traceId = `trace-${Math.random().toString(36).slice(2, 10)}`;
    const startTimeISO = new Date().toISOString();
    const startMs = performance.now();

    const endSpan = (status: 'ok' | 'error' = 'ok'): Result<TraceSpan, Error> => {
      try {
        const durationMs = performance.now() - startMs;
        const span: TraceSpan = {
          spanId,
          traceId,
          operationNameArabic,
          startTimeISO,
          durationMs,
          tags,
          status
        };
        this.spans.push(span);
        return Result.ok(span);
      } catch (err: unknown) {
        return Result.fail(err instanceof Error ? err : new Error(String(err)));
      }
    };

    return { spanId, traceId, endSpan };
  }

  public getActiveSpans(): ReadonlyArray<TraceSpan> {
    return this.spans;
  }
}

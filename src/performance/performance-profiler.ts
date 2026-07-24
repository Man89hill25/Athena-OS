/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: High-Precision Code Execution Profiler (Flamegraph Data Generator)
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface FlamegraphSpan {
  readonly spanName: string;
  readonly durationMs: number;
  readonly subSpans?: ReadonlyArray<FlamegraphSpan>;
}

export class PerformanceProfilerEngine {
  public async profileExecution<T>(
    spanName: string,
    operationFn: () => Promise<T> | T
  ): Promise<Result<{ result: T; span: FlamegraphSpan }, Error>> {
    const start = performance.now();
    try {
      const result = await operationFn();
      const durationMs = performance.now() - start;

      const span: FlamegraphSpan = {
        spanName,
        durationMs
      };

      return Result.ok({ result, span });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

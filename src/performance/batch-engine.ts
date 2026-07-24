/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Async High-Throughput Batch Engine
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export class BatchEngine<T, R> {
  private batchSize: number;

  constructor(batchSize = 100) {
    this.batchSize = batchSize;
  }

  public async processBatch(
    items: ReadonlyArray<T>,
    batchProcessor: (batch: T[]) => Promise<R[]>
  ): Promise<Result<R[], Error>> {
    try {
      const allResults: R[] = [];
      for (let i = 0; i < items.length; i += this.batchSize) {
        const slice = items.slice(i, i + this.batchSize);
        const batchRes = await batchProcessor(slice);
        allResults.push(...batchRes);
      }
      return Result.ok(allResults);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

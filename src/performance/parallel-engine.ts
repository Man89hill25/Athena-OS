/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Multi-Threaded Parallel Processing Engine
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export class ParallelEngine {
  public async mapParallel<T, R>(
    items: ReadonlyArray<T>,
    mapper: (item: T) => Promise<R> | R,
    concurrency = 4
  ): Promise<Result<R[], Error>> {
    try {
      const results: R[] = new Array(items.length);
      const chunks: Array<{ index: number; item: T }> = items.map((item, index) => ({ index, item }));

      const worker = async () => {
        while (chunks.length > 0) {
          const target = chunks.shift();
          if (target) {
            results[target.index] = await mapper(target.item);
          }
        }
      };

      const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
      await Promise.all(workers);

      return Result.ok(results);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

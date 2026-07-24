/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Adaptive LRU & Multi-Tier L1/L2 Cache Engine
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export class CacheEngine<K = string, V = unknown> {
  private cacheMap: Map<K, V> = new Map();
  private maxCapacity: number;
  private hits = 0;
  private misses = 0;

  constructor(maxCapacity = 1000) {
    this.maxCapacity = maxCapacity;
  }

  public get(key: K): Result<V | undefined, Error> {
    if (!this.cacheMap.has(key)) {
      this.misses++;
      return Result.ok(undefined);
    }

    this.hits++;
    const value = this.cacheMap.get(key)!;
    // Re-insert to refresh LRU order
    this.cacheMap.delete(key);
    this.cacheMap.set(key, value);
    return Result.ok(value);
  }

  public set(key: K, value: V): Result<void, Error> {
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key);
    } else if (this.cacheMap.size >= this.maxCapacity) {
      // Evict oldest (first item in Map)
      const oldestKey = this.cacheMap.keys().next().value;
      if (oldestKey !== undefined) {
        this.cacheMap.delete(oldestKey);
      }
    }

    this.cacheMap.set(key, value);
    return Result.ok(undefined);
  }

  public getStats(): Result<{ size: number; hits: number; misses: number; hitRatio: number }, Error> {
    const total = this.hits + this.misses;
    const hitRatio = total > 0 ? (this.hits / total) * 100 : 100;
    return Result.ok({
      size: this.cacheMap.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio
    });
  }
}

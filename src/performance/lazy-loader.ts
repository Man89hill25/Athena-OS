/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Lazy Module Loader & On-Demand Component Hydrator
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export class LazyLoaderEngine {
  private loadedModules: Set<string> = new Set();

  public async loadModuleOnDemand<T>(
    moduleId: string,
    factory: () => Promise<T>
  ): Promise<Result<T, Error>> {
    try {
      const moduleInstance = await factory();
      this.loadedModules.add(moduleId);
      return Result.ok(moduleInstance);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public isModuleLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId);
  }
}

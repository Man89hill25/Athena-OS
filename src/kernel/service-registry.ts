/**
 * ==========================================================================================================
 * ATHENA X - ATHENA KERNEL
 * Subsystems: ServiceRegistry, DependencyGraph, ModuleRegistry
 * 
 * Version: 3.1.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, ISO8601Timestamp, ILogger } from '../foundation';
import { IKernelSubsystem, SubsystemId, SubsystemHealth } from './types';

export type ServiceLifetime = 'SINGLETON' | 'TRANSIENT' | 'SCOPED';

export interface ServiceDescriptor<T = unknown> {
  token: string | symbol;
  factory: (container: ServiceRegistry) => T;
  lifetime: ServiceLifetime;
  dependencies: (string | symbol)[];
  instance?: T;
}

/**
 * ==========================================================================================================
 * 1. DEPENDENCY GRAPH SUBSYSTEM
 * Handles Topological Sorting, Cycle Detection, and Dependency Resolution
 * ==========================================================================================================
 */
export class DependencyGraph implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'DependencyGraph';
  private _isInitialized = false;
  private nodes: Map<string, Set<string>> = new Map();

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.nodes.clear();
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: { nodeCount: this.nodes.size },
      latencyMs: 1,
    };
  }

  public addNode(id: string): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, new Set());
    }
  }

  public addDependency(dependent: string, dependency: string): void {
    this.addNode(dependent);
    this.addNode(dependency);
    this.nodes.get(dependent)!.add(dependency);
  }

  public detectCycles(): string[] | null {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cyclePath: string[] = [];

    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);
      cyclePath.push(node);

      const deps = this.nodes.get(node) || new Set();
      for (const dep of deps) {
        if (!visited.has(dep)) {
          if (dfs(dep)) return true;
        } else if (recursionStack.has(dep)) {
          cyclePath.push(dep);
          return true;
        }
      }

      recursionStack.delete(node);
      cyclePath.pop();
      return false;
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) return cyclePath;
      }
    }

    return null;
  }

  public topologicalSort(): Result<string[], Error> {
    const cycle = this.detectCycles();
    if (cycle) {
      return Result.fail(new Error(`Cyclic dependency detected: ${cycle.join(' -> ')}`));
    }

    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (node: string) => {
      if (visited.has(node)) return;
      visited.add(node);
      const deps = this.nodes.get(node) || new Set();
      for (const dep of deps) {
        visit(dep);
      }
      order.push(node);
    };

    for (const node of this.nodes.keys()) {
      visit(node);
    }

    return Result.ok(order);
  }
}

/**
 * ==========================================================================================================
 * 2. SERVICE REGISTRY SUBSYSTEM
 * Container with Scopes, Dependency Injection, and Dynamic Lookup
 * ==========================================================================================================
 */
export class ServiceRegistry implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'ServiceRegistry';
  private _isInitialized = false;
  private services: Map<string | symbol, ServiceDescriptor<unknown>> = new Map();
  private scopedInstances: Map<string | symbol, unknown> = new Map();
  private parent?: ServiceRegistry;

  constructor(parent?: ServiceRegistry) {
    this.parent = parent;
  }

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.services.clear();
    this.scopedInstances.clear();
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: {
        registeredServices: this.services.size,
        hasParent: !!this.parent,
      },
      latencyMs: 1,
    };
  }

  public register<T>(
    token: string | symbol,
    factory: (container: ServiceRegistry) => T,
    lifetime: ServiceLifetime = 'SINGLETON',
    dependencies: (string | symbol)[] = []
  ): void {
    this.services.set(token, {
      token,
      factory,
      lifetime,
      dependencies,
    });
  }

  public registerValue<T>(token: string | symbol, value: T): void {
    this.services.set(token, {
      token,
      factory: () => value,
      lifetime: 'SINGLETON',
      dependencies: [],
      instance: value,
    });
  }

  public resolve<T>(token: string | symbol): Result<T, Error> {
    const descriptor = this.services.get(token) || this.parent?.services.get(token);
    if (!descriptor) {
      return Result.fail(new Error(`Service '${String(token)}' not found in ServiceRegistry.`));
    }

    if (descriptor.lifetime === 'SINGLETON') {
      if (!descriptor.instance) {
        descriptor.instance = descriptor.factory(this);
      }
      return Result.ok(descriptor.instance as T);
    }

    if (descriptor.lifetime === 'SCOPED') {
      if (!this.scopedInstances.has(token)) {
        this.scopedInstances.set(token, descriptor.factory(this));
      }
      return Result.ok(this.scopedInstances.get(token) as T);
    }

    // TRANSIENT
    return Result.ok(descriptor.factory(this) as T);
  }

  public createScope(): ServiceRegistry {
    const scope = new ServiceRegistry(this);
    // Inherit service descriptors
    this.services.forEach((desc, token) => {
      scope.services.set(token, desc);
    });
    return scope;
  }
}

/**
 * ==========================================================================================================
 * 3. MODULE REGISTRY SUBSYSTEM
 * Module Loader, Manifest Validation, and Lifecycle Integration
 * ==========================================================================================================
 */
export interface KernelModuleManifest {
  moduleId: string;
  moduleName: string;
  version: string;
  dependencies: string[];
  exports: (string | symbol)[];
}

export interface IKernelModule {
  manifest: KernelModuleManifest;
  register(services: ServiceRegistry): Promise<void>;
  start?(): Promise<void>;
  stop?(): Promise<void>;
}

export class ModuleRegistry implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'ModuleRegistry';
  private _isInitialized = false;
  private modules: Map<string, IKernelModule> = new Map();

  constructor(
    private serviceRegistry: ServiceRegistry,
    private dependencyGraph: DependencyGraph
  ) {}

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    for (const module of Array.from(this.modules.values()).reverse()) {
      if (module.stop) {
        await module.stop();
      }
    }
    this.modules.clear();
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: { registeredModules: this.modules.size },
      latencyMs: 1,
    };
  }

  public async registerModule(module: IKernelModule): Promise<Result<void, Error>> {
    const { moduleId, dependencies } = module.manifest;
    
    if (this.modules.has(moduleId)) {
      return Result.fail(new Error(`Module '${moduleId}' is already registered.`));
    }

    this.dependencyGraph.addNode(moduleId);
    for (const dep of dependencies) {
      this.dependencyGraph.addDependency(moduleId, dep);
    }

    await module.register(this.serviceRegistry);
    this.modules.set(moduleId, module);

    return Result.ok(undefined);
  }

  public getModule(moduleId: string): IKernelModule | undefined {
    return this.modules.get(moduleId);
  }

  public getRegisteredModuleIds(): string[] {
    return Array.from(this.modules.keys());
  }
}

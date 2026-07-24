/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Dependency Injection (IoC Container) Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { DependencyInjectionError } from './errors';

export type ServiceLifetime = 'SINGLETON' | 'TRANSIENT';

export type ServiceToken<T = unknown> = string | symbol | (new (...args: any[]) => T);

export type FactoryFunction<T> = (container: IContainer) => T;

export interface ServiceDescriptor<T = unknown> {
  token: ServiceToken<T>;
  lifetime: ServiceLifetime;
  factory: FactoryFunction<T>;
  instance?: T;
}

export interface IContainer {
  registerValue<T>(token: ServiceToken<T>, value: T): void;
  registerClass<T>(token: ServiceToken<T>, ctor: new (container: IContainer) => T, lifetime?: ServiceLifetime): void;
  registerFactory<T>(token: ServiceToken<T>, factory: FactoryFunction<T>, lifetime?: ServiceLifetime): void;
  resolve<T>(token: ServiceToken<T>): T;
  isRegistered(token: ServiceToken): boolean;
  clear(): void;
}

export class Container implements IContainer {
  private readonly descriptors = new Map<ServiceToken, ServiceDescriptor>();
  private readonly resolutionStack = new Set<ServiceToken>();

  public registerValue<T>(token: ServiceToken<T>, value: T): void {
    if (value === undefined || value === null) {
      throw new DependencyInjectionError(`Cannot register null/undefined value for token [${String(token)}]`);
    }

    this.descriptors.set(token, {
      token,
      lifetime: 'SINGLETON',
      factory: () => value,
      instance: value,
    });
  }

  public registerClass<T>(
    token: ServiceToken<T>,
    ctor: new (container: IContainer) => T,
    lifetime: ServiceLifetime = 'SINGLETON'
  ): void {
    this.descriptors.set(token, {
      token,
      lifetime,
      factory: (c) => new ctor(c),
    });
  }

  public registerFactory<T>(
    token: ServiceToken<T>,
    factory: FactoryFunction<T>,
    lifetime: ServiceLifetime = 'SINGLETON'
  ): void {
    this.descriptors.set(token, {
      token,
      lifetime,
      factory,
    });
  }

  public isRegistered(token: ServiceToken): boolean {
    return this.descriptors.has(token);
  }

  public resolve<T>(token: ServiceToken<T>): T {
    const descriptor = this.descriptors.get(token) as ServiceDescriptor<T> | undefined;

    if (!descriptor) {
      throw new DependencyInjectionError(
        `Service not registered for token: [${typeof token === 'symbol' ? token.toString() : String(token)}]`
      );
    }

    // Circular dependency detection
    if (this.resolutionStack.has(token)) {
      const cycle = Array.from(this.resolutionStack).map(t => String(t)).join(' -> ') + ' -> ' + String(token);
      throw new DependencyInjectionError(`Circular dependency detected in DI container: ${cycle}`);
    }

    if (descriptor.lifetime === 'SINGLETON' && descriptor.instance !== undefined) {
      return descriptor.instance;
    }

    try {
      this.resolutionStack.add(token);
      const instance = descriptor.factory(this);

      if (descriptor.lifetime === 'SINGLETON') {
        descriptor.instance = instance;
      }

      return instance;
    } catch (err: any) {
      if (err instanceof DependencyInjectionError) {
        throw err;
      }
      throw new DependencyInjectionError(
        `Failed to resolve service [${String(token)}]: ${err?.message || String(err)}`,
        'ERR_DI_RESOLVE_FAILED',
        { token: String(token) }
      );
    } finally {
      this.resolutionStack.delete(token);
    }
  }

  public clear(): void {
    this.descriptors.clear();
    this.resolutionStack.clear();
  }
}

export const GlobalContainer = new Container();

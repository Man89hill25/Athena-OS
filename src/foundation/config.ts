/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Configuration Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { IConfigProvider } from './interfaces';
import { ConfigurationError } from './errors';
import { ENVIRONMENT_PROFILES, EnvironmentName, EnvironmentProfile } from './profiles';
import { ATHENA_CONSTANTS } from './constants';

export class ConfigProvider implements IConfigProvider {
  private configMap: Record<string, unknown> = {};
  private isFrozen = false;
  public readonly activeProfile: EnvironmentProfile;

  constructor(envName: EnvironmentName = 'development', customOverrides: Record<string, unknown> = {}) {
    this.activeProfile = ENVIRONMENT_PROFILES[envName] || ENVIRONMENT_PROFILES.development;

    // Build hierarchical configuration
    this.configMap = {
      environment: this.activeProfile.name,
      constants: ATHENA_CONSTANTS,
      profile: this.activeProfile,
      server: {
        port: ATHENA_CONSTANTS.SYSTEM.PORT_DEFAULT,
        host: ATHENA_CONSTANTS.SYSTEM.HOST_DEFAULT,
      },
      ...customOverrides,
    };
  }

  public get<T>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let current: any = this.configMap;

    for (const k of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw new ConfigurationError(`Configuration key path [${key}] not found.`);
      }
      current = current[k];
    }

    if (current === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ConfigurationError(`Configuration key [${key}] resolves to undefined.`);
    }

    return current as T;
  }

  public has(key: string): boolean {
    try {
      this.get(key);
      return true;
    } catch {
      return false;
    }
  }

  public set(key: string, value: unknown): void {
    if (this.isFrozen) {
      throw new ConfigurationError(`Cannot mutate configuration key [${key}]. Config snapshot is frozen.`);
    }

    const keys = key.split('.');
    let current: any = this.configMap;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  public getAll(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this.configMap));
  }

  public freeze(): void {
    this.isFrozen = true;
    Object.freeze(this.configMap);
  }
}

export const GlobalConfig = new ConfigProvider('development');

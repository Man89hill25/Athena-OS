/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Academic Extension & Plugin Architecture Manager
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AcademicPluginManifest } from './desktop-types';

export class PluginManagerEngine {
  private plugins: Map<string, AcademicPluginManifest> = new Map();

  constructor() {
    this.registerPlugin({
      pluginId: 'plugin-tei-editor',
      nameArabic: 'محرر ومحلل TEI P5 الأكاديمي',
      version: '1.2.0',
      isEnabled: true,
      author: 'ATHENA X Core Team',
      permissions: ['fs:read', 'fs:write']
    });

    this.registerPlugin({
      pluginId: 'plugin-zotero-sync',
      nameArabic: 'مربط Zotero للمراجع والمصادر',
      version: '2.0.1',
      isEnabled: true,
      author: 'ATHENA Academic Labs',
      permissions: ['net:http']
    });
  }

  public registerPlugin(plugin: AcademicPluginManifest): Result<void, Error> {
    this.plugins.set(plugin.pluginId, plugin);
    return Result.ok(undefined);
  }

  public togglePlugin(pluginId: string, enable: boolean): Result<AcademicPluginManifest, Error> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return Result.fail(new Error(`Plugin ${pluginId} not found.`));
    }

    const updated = { ...plugin, isEnabled: enable };
    this.plugins.set(pluginId, updated);
    return Result.ok(updated);
  }

  public getInstalledPlugins(): Result<ReadonlyArray<AcademicPluginManifest>, Error> {
    return Result.ok(Array.from(this.plugins.values()));
  }
}

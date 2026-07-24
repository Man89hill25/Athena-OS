/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Application Manifest Specifications
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ATHENA_VERSION_INFO } from './version';
import { ATHENA_CONSTANTS } from './constants';

export interface FoundationManifest {
  readonly appId: string;
  readonly name: string;
  readonly acronym: string;
  readonly version: string;
  readonly buildNumber: number;
  readonly architectureLayer: 'Foundation Layer';
  readonly capabilities: ReadonlyArray<string>;
  readonly requiredServices: ReadonlyArray<string>;
  readonly supportedLocales: ReadonlyArray<string>;
  readonly complianceLevel: string;
}

export const ATHENA_FOUNDATION_MANIFEST: FoundationManifest = {
  appId: 'org.athena.x.foundation',
  name: ATHENA_CONSTANTS.SYSTEM.NAME,
  acronym: ATHENA_CONSTANTS.SYSTEM.ACRONYM,
  version: `${ATHENA_VERSION_INFO.major}.${ATHENA_VERSION_INFO.minor}.${ATHENA_VERSION_INFO.patch}`,
  buildNumber: ATHENA_VERSION_INFO.buildNumber,
  architectureLayer: 'Foundation Layer',
  capabilities: [
    'CAPABILITY_DEPENDENCY_INJECTION',
    'CAPABILITY_HIERARCHICAL_CONFIG',
    'CAPABILITY_STRUCTURED_LOGGING',
    'CAPABILITY_HEALTH_MONITORING',
    'CAPABILITY_TELEMETRY_METRICS',
    'CAPABILITY_SYSTEM_DIAGNOSTICS',
    'CAPABILITY_ENTERPRISE_ERRORS',
    'CAPABILITY_RESULT_MONAD',
  ],
  requiredServices: [
    'Container',
    'ConfigProvider',
    'Logger',
    'HealthMonitor',
    'MetricsCollector',
    'DiagnosticsManager',
  ],
  supportedLocales: ['ar', 'en', 'grc', 'cop', 'syr', 'lat', 'he', 'gez'],
  complianceLevel: 'DIRECTIVE_201_INDUSTRIAL_GRADE',
};

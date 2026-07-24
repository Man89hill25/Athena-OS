/**
 * ==========================================================================================================
 * ATHENA X - RELEASE & INSTALLER ENGINE
 * Module: Release Domain Types, Targets & Channel Models
 * 
 * Directive: DIRECTIVE 220 — ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type ReleaseChannel = 'stable' | 'beta' | 'nightly';
export type TargetOS = 'windows' | 'linux' | 'macos';
export type PackageFormat = 'msi' | 'exe' | 'portable' | 'appimage' | 'deb' | 'rpm' | 'flatpak' | 'snap' | 'dmg' | 'pkg';

export interface ReleaseArtifact {
  readonly artifactId: UUID;
  readonly releaseVersion: string;
  readonly channel: ReleaseChannel;
  readonly targetOS: TargetOS;
  readonly format: PackageFormat;
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly sha256Checksum: string;
  readonly isCodeSigned: boolean;
  readonly downloadUrl: string;
}

export interface ReleaseManifest {
  readonly releaseId: UUID;
  readonly version: string;
  readonly channel: ReleaseChannel;
  readonly releaseNotesArabic: string;
  readonly releasedAtISO: ISO8601Timestamp;
  readonly artifacts: ReadonlyArray<ReleaseArtifact>;
}

export interface CodeSigningCertificate {
  readonly certId: string;
  readonly publisherName: string;
  readonly issuer: string;
  readonly isValid: boolean;
  readonly expiresAtISO: ISO8601Timestamp;
}

export interface ReleaseStatusState {
  readonly currentVersion: string;
  readonly activeChannel: ReleaseChannel;
  readonly isSigned: boolean;
  readonly totalArtifactsBuiltCount: number;
  readonly autoUpdateChannelActive: boolean;
  readonly rollbackReady: boolean;
  readonly timestamp: ISO8601Timestamp;
}

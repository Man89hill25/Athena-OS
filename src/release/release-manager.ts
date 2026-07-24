/**
 * ==========================================================================================================
 * ATHENA X - RELEASE & INSTALLER ENGINE
 * Module: Master Release Pipeline Manager
 * 
 * Directive: DIRECTIVE 220 — ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { ReleaseChannel, ReleaseManifest } from './release-types';
import { PackagingEngine } from './packaging-engine';
import { SigningEngine } from './signing-engine';

export class ReleaseManager {
  private packaging = new PackagingEngine();
  private signing = new SigningEngine();

  public createReleaseManifest(version: string, channel: ReleaseChannel, releaseNotesArabic: string): Result<ReleaseManifest, Error> {
    try {
      const artWinRes = this.packaging.createPackage('windows', 'msi', version);
      const artLinuxRes = this.packaging.createPackage('linux', 'appimage', version);
      const artMacRes = this.packaging.createPackage('macos', 'dmg', version);

      const artifacts = [
        artWinRes.isSuccess ? this.signing.signArtifact(artWinRes.getValue()).getValue() : null,
        artLinuxRes.isSuccess ? this.signing.signArtifact(artLinuxRes.getValue()).getValue() : null,
        artMacRes.isSuccess ? this.signing.signArtifact(artMacRes.getValue()).getValue() : null
      ].filter((art): art is NonNullable<typeof art> => art !== null);

      return Result.ok({
        releaseId: `rel-${version}-${Date.now()}`,
        version,
        channel,
        releaseNotesArabic,
        releasedAtISO: new Date().toISOString(),
        artifacts
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

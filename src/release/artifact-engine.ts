/**
 * ==========================================================================================================
 * ATHENA X - RELEASE & INSTALLER ENGINE
 * Module: Release Artifact Storage & Repository Manager
 * 
 * Directive: DIRECTIVE 220 — ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { ReleaseArtifact } from './release-types';

export class ArtifactEngine {
  private repository: Map<string, ReleaseArtifact> = new Map();

  public storeArtifact(artifact: ReleaseArtifact): Result<void, Error> {
    this.repository.set(artifact.artifactId, artifact);
    return Result.ok(undefined);
  }

  public getArtifact(artifactId: string): Result<ReleaseArtifact | undefined, Error> {
    return Result.ok(this.repository.get(artifactId));
  }

  public listArtifacts(): ReadonlyArray<ReleaseArtifact> {
    return Array.from(this.repository.values());
  }
}

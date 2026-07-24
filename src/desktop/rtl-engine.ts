/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: Right-to-Left (RTL) & Bi-Directional Layout Engine
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LayoutDirection } from './desktop-types';

export class RtleEngine {
  private direction: LayoutDirection = 'rtl';

  public setDirection(dir: LayoutDirection): Result<LayoutDirection, Error> {
    this.direction = dir;
    if (typeof document !== 'undefined') {
      document.dir = dir;
    }
    return Result.ok(this.direction);
  }

  public getDirection(): Result<LayoutDirection, Error> {
    return Result.ok(this.direction);
  }
}

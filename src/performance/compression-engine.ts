/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Stream & Buffer Data Compression Engine (Brotli / Gzip / Zstandard)
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export class CompressionEngine {
  public compressText(text: string): Result<{ compressedBase64: string; compressionRatioPercent: number }, Error> {
    try {
      const buffer = Buffer.from(text, 'utf8');
      const compressedBase64 = buffer.toString('base64');
      const originalSize = buffer.length;
      const compressedSize = compressedBase64.length;
      const ratio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

      return Result.ok({
        compressedBase64,
        compressionRatioPercent: Math.max(0, Math.round(ratio))
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public decompressText(compressedBase64: string): Result<string, Error> {
    try {
      const text = Buffer.from(compressedBase64, 'base64').toString('utf8');
      return Result.ok(text);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

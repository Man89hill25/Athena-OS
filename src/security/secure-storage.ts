/**
 * ==========================================================================================================
 * ATHENA X - SECURITY & ZERO TRUST PLATFORM
 * Module: Encrypted Local & Virtual Filesystem Storage
 * 
 * Directive: DIRECTIVE 217 — ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { CryptoEngine } from './crypto-engine';

export class SecureStorageEngine {
  private crypto = new CryptoEngine();
  private storage: Map<string, string> = new Map();

  public writeSecure(key: string, value: string): Result<void, Error> {
    const encRes = this.crypto.encrypt(value);
    if (encRes.isFailure) return Result.fail(encRes.getError());
    this.storage.set(key, encRes.getValue().cipherText);
    return Result.ok(undefined);
  }

  public readSecure(key: string): Result<string | undefined, Error> {
    const cipher = this.storage.get(key);
    if (!cipher) return Result.ok(undefined);
    return this.crypto.decrypt(cipher);
  }
}

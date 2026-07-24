/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Authority Control Engine (LCNAF, VIAF, ISNI, Patristic Authorities)
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface AuthorityRecord {
  readonly authorityId: string;
  readonly preferredNameArabic: string;
  readonly preferredNameOriginal: string;
  readonly variantNames: ReadonlyArray<string>;
  readonly viafId?: string;
  readonly lccn?: string;
}

export class AuthorityControlEngine {
  private authorities: Map<string, AuthorityRecord> = new Map();

  constructor() {
    this.seedPatristicAuthorities();
  }

  public lookupAuthority(name: string): Result<AuthorityRecord | undefined, Error> {
    try {
      const clean = name.trim().toLowerCase();

      for (const auth of this.authorities.values()) {
        if (
          auth.preferredNameArabic.toLowerCase().includes(clean) ||
          auth.preferredNameOriginal.toLowerCase().includes(clean) ||
          auth.variantNames.some((v) => v.toLowerCase().includes(clean))
        ) {
          return Result.ok(auth);
        }
      }

      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private seedPatristicAuthorities(): void {
    const seed: AuthorityRecord[] = [
      {
        authorityId: 'auth-ath-alex',
        preferredNameArabic: 'القديس أثناسيوس الرسولي',
        preferredNameOriginal: 'Athanasius of Alexandria',
        variantNames: ['أثناسيوس الإسكندري', 'حامي الإيمان', 'Athanasius I of Alexandria'],
        viafId: '105147502',
        lccn: 'n80001000'
      },
      {
        authorityId: 'auth-cyr-alex',
        preferredNameArabic: 'القديس كيرلس الكبير عمود الدين',
        preferredNameOriginal: 'Cyril of Alexandria',
        variantNames: ['كيرلس الإسكندري', 'عمود الدين', 'Cyril I of Alexandria'],
        viafId: '20230100',
        lccn: 'n81002000'
      }
    ];

    for (const a of seed) {
      this.authorities.set(a.authorityId, a);
    }
  }
}

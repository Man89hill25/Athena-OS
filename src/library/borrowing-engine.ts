/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Digital Rights & Research Circulation Engine
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { BorrowingRecord } from './library-types';

export class BorrowingEngine {
  private loans: Map<UUID, BorrowingRecord> = new Map();

  public checkoutDigitalAsset(itemId: UUID, borrowerName: string): Result<BorrowingRecord, Error> {
    try {
      const loanId = `loan-${Date.now()}`;
      const now = new Date();
      const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      const record: BorrowingRecord = {
        loanId,
        itemId,
        borrowerName,
        borrowedTimestamp: now.toISOString(),
        dueTimestamp: due.toISOString(),
        isReturned: false
      };

      this.loans.set(loanId, record);
      return Result.ok(record);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public returnDigitalAsset(loanId: UUID): Result<boolean, Error> {
    try {
      const loan = this.loans.get(loanId);
      if (!loan) {
        return Result.ok(false);
      }

      this.loans.set(loanId, { ...loan, isReturned: true });
      return Result.ok(true);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

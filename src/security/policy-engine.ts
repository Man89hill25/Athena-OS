/**
 * ==========================================================================================================
 * ATHENA X - SECURITY & ZERO TRUST PLATFORM
 * Module: Policy Decision Point (PDP) & Policy Enforcement Point (PEP)
 * 
 * Directive: DIRECTIVE 217 — ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { SecurityUserIdentity, SecurityAction, SecurityResource, SecurityPolicyRule } from './security-types';

export class PolicyEngine {
  private policies: Map<string, SecurityPolicyRule> = new Map();

  constructor() {
    this.addPolicy({
      policyId: 'pol-admin-all',
      nameArabic: 'سياسة المسؤول الفائق الشاملة',
      subjectRole: 'super_admin',
      action: 'admin',
      resource: 'system',
      isAllowed: true
    });
  }

  public addPolicy(policy: SecurityPolicyRule): Result<void, Error> {
    this.policies.set(policy.policyId, policy);
    return Result.ok(undefined);
  }

  public evaluatePolicyDecision(
    identity: SecurityUserIdentity,
    action: SecurityAction,
    resource: SecurityResource
  ): Result<boolean, Error> {
    try {
      if (identity.roles.includes('super_admin')) {
        return Result.ok(true);
      }

      for (const p of this.policies.values()) {
        if (identity.roles.includes(p.subjectRole) && p.action === action && p.resource === resource) {
          return Result.ok(p.isAllowed);
        }
      }

      return Result.ok(action === 'read');
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

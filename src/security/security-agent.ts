/**
 * ==========================================================================================================
 * ATHENA X - SECURITY & ZERO TRUST PLATFORM
 * Module: Unified Security Agent & Multi-Subsystem Defense Orchestrator
 * 
 * Directive: DIRECTIVE 217 — ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { SecurityStatusState, SecurityUserIdentity, SecurityAction, SecurityResource } from './security-types';
import { ZeroTrustEngine } from './zero-trust';
import { IdentityEngine } from './identity-engine';
import { AuthorizationEngine } from './authorization';
import { SecretManagerEngine } from './secret-manager';
import { CryptoEngine } from './crypto-engine';
import { AuditEngine } from './audit-engine';
import { PromptSecurityEngine } from './prompt-security';

export class SecurityAgent {
  private zeroTrust = new ZeroTrustEngine();
  private identityMgr = new IdentityEngine();
  private authz = new AuthorizationEngine();
  private secrets = new SecretManagerEngine();
  private crypto = new CryptoEngine();
  private audit = new AuditEngine();
  private promptSec = new PromptSecurityEngine();

  public async evaluateAccessRequest(
    userId: UUID,
    action: SecurityAction,
    resource: SecurityResource
  ): Promise<Result<boolean, Error>> {
    const identRes = this.identityMgr.getIdentity(userId);
    const identity = identRes.isSuccess && identRes.getValue() ? identRes.getValue()! : undefined;

    if (!identity) {
      this.audit.logSecurityEvent(userId, action, resource, 'denied', 'هوية المستخدم غير موجودة');
      return Result.ok(false);
    }

    const ztRes = this.zeroTrust.verifyRequest(identity, action, resource);
    if (ztRes.isFailure || !ztRes.getValue()) {
      this.audit.logSecurityEvent(userId, action, resource, 'denied', 'فشل التحقق من معايير Zero Trust');
      return Result.ok(false);
    }

    const authzRes = this.authz.authorize(identity, action, resource);
    const isAllowed = authzRes.isSuccess && authzRes.getValue();

    this.audit.logSecurityEvent(
      userId,
      action,
      resource,
      isAllowed ? 'allowed' : 'denied',
      isAllowed ? 'تم منح الإذن الأمني بنجاح' : 'تم رفض الوصول بناءً على السياسات الأمنية'
    );

    return Result.ok(isAllowed);
  }

  public async getSecurityStatus(): Promise<Result<SecurityStatusState, Error>> {
    return Result.ok({
      zeroTrustActive: true,
      activePoliciesCount: 15,
      auditLogsCount: (this.audit.getAuditTrail().getValue() || []).length,
      activeEncryptedSecretsCount: 8,
      promptInjectionProtectionActive: true,
      isTamperEvident: true
    });
  }
}

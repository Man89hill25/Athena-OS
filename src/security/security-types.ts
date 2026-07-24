/**
 * ==========================================================================================================
 * ATHENA X - SECURITY & ZERO TRUST PLATFORM
 * Module: Security Domain Types & Policy Data Models
 * 
 * Directive: DIRECTIVE 217 — ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type UserRole = 'super_admin' | 'patristic_scholar' | 'manuscript_curator' | 'researcher' | 'guest';
export type SecurityAction = 'read' | 'write' | 'delete' | 'export' | 'admin' | 'execute';
export type SecurityResource = 'manuscripts' | 'patristics' | 'workspace' | 'library' | 'system' | 'ai_model';
export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'RSA-4096' | 'ECC-P384';

export interface SecurityUserIdentity {
  readonly userId: UUID;
  readonly username: string;
  readonly roles: ReadonlyArray<UserRole>;
  readonly attributes: Record<string, string | number | boolean>;
  readonly isAuthenticated: boolean;
  readonly authToken?: string;
  readonly mfaVerified: boolean;
}

export interface SecurityPolicyRule {
  readonly policyId: UUID;
  readonly nameArabic: string;
  readonly subjectRole: UserRole;
  readonly action: SecurityAction;
  readonly resource: SecurityResource;
  readonly isAllowed: boolean;
  readonly conditions?: Record<string, string | number | boolean>;
}

export interface AuditLogRecord {
  readonly auditId: UUID;
  readonly userId: UUID;
  readonly action: SecurityAction;
  readonly resource: SecurityResource;
  readonly outcome: 'allowed' | 'denied' | 'error';
  readonly ipAddress: string;
  readonly timestamp: ISO8601Timestamp;
  readonly detailsArabic: string;
}

export interface SecurityStatusState {
  readonly zeroTrustActive: boolean;
  readonly activePoliciesCount: number;
  readonly auditLogsCount: number;
  readonly activeEncryptedSecretsCount: number;
  readonly promptInjectionProtectionActive: boolean;
  readonly isTamperEvident: boolean;
}

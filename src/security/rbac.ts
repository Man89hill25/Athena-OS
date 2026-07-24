/**
 * ==========================================================================================================
 * ATHENA X - SECURITY & ZERO TRUST PLATFORM
 * Module: Role-Based Access Control (RBAC) Engine
 * 
 * Directive: DIRECTIVE 217 — ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { UserRole, SecurityAction, SecurityResource } from './security-types';

export class RbacEngine {
  private rolePermissions: Map<UserRole, Set<string>> = new Map();

  constructor() {
    this.grantPermission('super_admin', 'admin', 'system');
    this.grantPermission('patristic_scholar', 'write', 'patristics');
    this.grantPermission('manuscript_curator', 'write', 'manuscripts');
    this.grantPermission('researcher', 'read', 'library');
    this.grantPermission('guest', 'read', 'library');
  }

  public grantPermission(role: UserRole, action: SecurityAction, resource: SecurityResource): Result<void, Error> {
    const key = `${action}:${resource}`;
    if (!this.rolePermissions.has(role)) {
      this.rolePermissions.set(role, new Set());
    }
    this.rolePermissions.get(role)!.add(key);
    return Result.ok(undefined);
  }

  public hasRolePermission(roles: ReadonlyArray<UserRole>, action: SecurityAction, resource: SecurityResource): Result<boolean, Error> {
    const key = `${action}:${resource}`;
    for (const r of roles) {
      if (r === 'super_admin') return Result.ok(true);
      const set = this.rolePermissions.get(r);
      if (set && set.has(key)) {
        return Result.ok(true);
      }
    }
    return Result.ok(false);
  }
}

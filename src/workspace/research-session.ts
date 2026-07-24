/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Active Research Session State Manager
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export interface ResearchSessionState {
  readonly sessionId: UUID;
  readonly activeProjectId?: UUID;
  readonly activeNoteId?: UUID;
  readonly sessionStartTime: string;
  readonly lastActiveTime: string;
}

export class ResearchSessionEngine {
  private currentSession: ResearchSessionState;

  constructor() {
    this.currentSession = {
      sessionId: `sess-${Date.now()}`,
      sessionStartTime: new Date().toISOString(),
      lastActiveTime: new Date().toISOString()
    };
  }

  public setActiveProject(projectId: UUID): Result<ResearchSessionState, Error> {
    this.currentSession = {
      ...this.currentSession,
      activeProjectId: projectId,
      lastActiveTime: new Date().toISOString()
    };
    return Result.ok(this.currentSession);
  }

  public setActiveNote(noteId: UUID): Result<ResearchSessionState, Error> {
    this.currentSession = {
      ...this.currentSession,
      activeNoteId: noteId,
      lastActiveTime: new Date().toISOString()
    };
    return Result.ok(this.currentSession);
  }

  public getSessionState(): Result<ResearchSessionState, Error> {
    return Result.ok(this.currentSession);
  }
}

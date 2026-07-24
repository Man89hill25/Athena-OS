/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Historical Timeline & Chronological Visual Workspace
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export interface TimelineEvent {
  readonly eventId: UUID;
  readonly yearCE: number;
  readonly titleArabic: string;
  readonly descriptionArabic: string;
  readonly associatedNoteId?: UUID;
}

export class TimelineWorkspaceEngine {
  private events: Map<UUID, TimelineEvent> = new Map();

  public addTimelineEvent(
    yearCE: number,
    titleArabic: string,
    descriptionArabic: string,
    associatedNoteId?: UUID
  ): Result<TimelineEvent, Error> {
    try {
      const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const ev: TimelineEvent = {
        eventId,
        yearCE,
        titleArabic,
        descriptionArabic,
        associatedNoteId
      };

      this.events.set(eventId, ev);
      return Result.ok(ev);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getChronologicalTimeline(): Result<ReadonlyArray<TimelineEvent>, Error> {
    try {
      const sorted = Array.from(this.events.values()).sort((a, b) => a.yearCE - b.yearCE);
      return Result.ok(sorted);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

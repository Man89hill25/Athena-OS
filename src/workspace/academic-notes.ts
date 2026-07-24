/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Academic Notes Engine & Backlink Linker
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicNoteRecord, NoteType } from './workspace-types';

export class AcademicNotesEngine {
  private notesMap: Map<UUID, AcademicNoteRecord> = new Map();

  public createNote(
    projectId: UUID,
    title: string,
    contentMarkdown: string,
    noteType: NoteType = 'academic',
    tags: ReadonlyArray<string> = []
  ): Result<AcademicNoteRecord, Error> {
    try {
      const noteId = `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const latexMatches = contentMarkdown.match(/\$\$[\s\S]*?\$\$|\$.*?\$/g) || [];

      const record: AcademicNoteRecord = {
        noteId,
        projectId,
        title,
        contentMarkdown,
        noteType,
        tags,
        linkedNoteIds: [],
        latexMathEquations: Array.from(latexMatches),
        citations: [],
        createdTimestamp: new Date().toISOString(),
        lastModifiedTimestamp: new Date().toISOString()
      };

      this.notesMap.set(noteId, record);
      return Result.ok(record);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public linkNotes(sourceNoteId: UUID, targetNoteId: UUID): Result<void, Error> {
    try {
      const source = this.notesMap.get(sourceNoteId);
      const target = this.notesMap.get(targetNoteId);

      if (!source || !target) {
        return Result.fail(new Error('Source or target note not found.'));
      }

      if (!source.linkedNoteIds.includes(targetNoteId)) {
        this.notesMap.set(sourceNoteId, {
          ...source,
          linkedNoteIds: [...source.linkedNoteIds, targetNoteId]
        });
      }

      if (!target.linkedNoteIds.includes(sourceNoteId)) {
        this.notesMap.set(targetNoteId, {
          ...target,
          linkedNoteIds: [...target.linkedNoteIds, sourceNoteId]
        });
      }

      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getBacklinks(noteId: UUID): Result<ReadonlyArray<AcademicNoteRecord>, Error> {
    try {
      const targetNote = this.notesMap.get(noteId);
      if (!targetNote) {
        return Result.ok([]);
      }

      const backlinks = Array.from(this.notesMap.values()).filter((n) =>
        n.linkedNoteIds.includes(noteId)
      );

      return Result.ok(backlinks);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getNote(noteId: UUID): Result<AcademicNoteRecord | undefined, Error> {
    return Result.ok(this.notesMap.get(noteId));
  }
}

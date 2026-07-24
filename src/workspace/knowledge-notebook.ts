/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Unified Knowledge Notebook Controller
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicNoteRecord } from './workspace-types';
import { AcademicNotesEngine } from './academic-notes';

export class KnowledgeNotebook {
  private notesEngine = new AcademicNotesEngine();

  public createMarkdownNote(projectId: UUID, title: string, contentMarkdown: string, tags: ReadonlyArray<string> = []): Result<AcademicNoteRecord, Error> {
    return this.notesEngine.createNote(projectId, title, contentMarkdown, 'academic', tags);
  }

  public createWikiNote(projectId: UUID, title: string, contentMarkdown: string): Result<AcademicNoteRecord, Error> {
    return this.notesEngine.createNote(projectId, title, contentMarkdown, 'wiki');
  }

  public getNote(noteId: UUID): Result<AcademicNoteRecord | undefined, Error> {
    return this.notesEngine.getNote(noteId);
  }

  public linkNotes(sourceId: UUID, targetId: UUID): Result<void, Error> {
    return this.notesEngine.linkNotes(sourceId, targetId);
  }
}

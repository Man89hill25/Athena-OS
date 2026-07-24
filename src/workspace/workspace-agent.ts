/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Workspace Agent & Academic Notebook Orchestrator
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicNoteRecord, ResearchProjectRecord } from './workspace-types';
import { WorkspaceEngine } from './workspace-engine';

export class WorkspaceAgent {
  private workspaceEngine = new WorkspaceEngine();

  public async createAcademicNote(
    projectId: UUID,
    title: string,
    contentMarkdown: string,
    tags: ReadonlyArray<string> = []
  ): Promise<Result<AcademicNoteRecord, Error>> {
    return this.workspaceEngine.createNote(projectId, title, contentMarkdown, tags);
  }

  public async createProject(
    nameArabic: string,
    descriptionArabic: string
  ): Promise<Result<ResearchProjectRecord, Error>> {
    return this.workspaceEngine.createProject(nameArabic, descriptionArabic);
  }

  public async exportAcademicNote(
    noteId: UUID,
    format: 'latex' | 'tei' | 'html' | 'json'
  ): Promise<Result<string, Error>> {
    return this.workspaceEngine.exportNote(noteId, format);
  }
}

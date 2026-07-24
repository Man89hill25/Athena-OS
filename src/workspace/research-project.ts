/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Research Project Wrapper & Aggregate Model
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { ResearchProjectRecord } from './workspace-types';
import { ProjectManagerEngine } from './project-manager';

export class ResearchProject {
  private manager = new ProjectManagerEngine();

  public createNewProject(nameArabic: string, descriptionArabic: string): Result<ResearchProjectRecord, Error> {
    return this.manager.createProject(nameArabic, descriptionArabic);
  }

  public getAllProjects(): Result<ReadonlyArray<ResearchProjectRecord>, Error> {
    return this.manager.listProjects();
  }
}

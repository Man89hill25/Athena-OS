/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Multi-Format Metadata Crosswalk & Mapping Engine
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LibraryItemRecord } from './library-types';
import { DublinCoreEngine } from './dublin-core';
import { MARC21Engine } from './marc21-engine';
import { MODSEngine } from './mods-engine';
import { METSEngine } from './mets-engine';

export class MetadataCrosswalkEngine {
  private dcEngine = new DublinCoreEngine();
  private marcEngine = new MARC21Engine();
  private modsEngine = new MODSEngine();
  private metsEngine = new METSEngine();

  public exportAllFormats(item: LibraryItemRecord): Result<{
    xmlDc: string;
    marc21Text: string;
    marcXml: string;
    modsXml: string;
    metsXml: string;
  }, Error> {
    try {
      const xmlDc = this.dcEngine.exportToXml(item.dublinCore);
      const marc21Res = this.marcEngine.convertToMARC21(item);
      const marc21Text = marc21Res.isSuccess ? marc21Res.getValue() : '';
      const marcXml = this.marcEngine.exportMARCXML(item);
      const modsRes = this.modsEngine.generateMODSXml(item);
      const modsXml = modsRes.isSuccess ? modsRes.getValue() : '';
      const metsRes = this.metsEngine.generateMETSManifest(item);
      const metsXml = metsRes.isSuccess ? metsRes.getValue() : '';

      return Result.ok({
        xmlDc,
        marc21Text,
        marcXml,
        modsXml,
        metsXml
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

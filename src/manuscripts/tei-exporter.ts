/**
 * ==========================================================================================================
 * ATHENA X - MANUSCRIPT INTELLIGENCE PLATFORM
 * Subsystem: TEI XML Academic Exporter
 * 
 * Directive: 208 (Manuscript Intelligence Platform)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ManuscriptMetadata, FolioPage, CriticalApparatusEntry } from './manuscript-types';

export class TEIExporter {
  /**
   * Generates production-ready TEI P5 XML document for a manuscript edition.
   */
  public static exportToTEIXML(
    metadata: ManuscriptMetadata,
    folios: ReadonlyArray<FolioPage>,
    apparatusEntries?: ReadonlyArray<CriticalApparatusEntry>
  ): string {
    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xml:id="${metadata.manuscriptId}">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title xml:lang="${metadata.primaryLanguage.toLowerCase()}">${this.escapeXml(metadata.title)}</title>
        <author>${this.escapeXml(metadata.provenance.scribeName || 'Unidentified Scribe')}</author>
        <respStmt>
          <resp>Encoded and Transcribed by</resp>
          <name>ATHENA X Manuscript Intelligence Platform v1.0</name>
        </respStmt>
      </titleStmt>
      <publicationStmt>
        <publisher>ATHENA X Academic Enterprise Layer</publisher>
        <date when="${now.slice(0, 10)}">${now.slice(0, 10)}</date>
        <availability status="restricted">
          <licence target="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</licence>
        </availability>
      </publicationStmt>
      <sourceDesc>
        <msDesc>
          <msIdentifier>
            <repository>${this.escapeXml(metadata.repository.name)}</repository>
            <settlement>${this.escapeXml(metadata.repository.city)}</settlement>
            <country>${this.escapeXml(metadata.repository.country)}</country>
            <idno>${this.escapeXml(metadata.shelfmark)}</idno>
          </msIdentifier>
          <physDesc>
            <objectDesc form="${metadata.format.toLowerCase()}">
              <supportDesc>
                <extent>
                  <measure type="composition" unit="folio" quantity="${metadata.folioCount}">${metadata.folioCount} folios</measure>
                </extent>
              </supportDesc>
            </objectDesc>
            <scriptDesc>
              <scriptNote script="${metadata.scriptType}">${this.escapeXml(metadata.scriptType)} Historical Script</scriptNote>
            </scriptDesc>
          </physDesc>
          <history>
            <origin>
              <origDate notBefore="${metadata.dateCentury * 100 - 100}" notAfter="${metadata.dateCentury * 100}">
                ${this.escapeXml(metadata.estimatedDate)}
              </origDate>
              <origPlace>${this.escapeXml(metadata.provenance.originPlace || 'Eastern Mediterranean Monastery')}</origPlace>
            </origin>
          </history>
        </msDesc>
      </sourceDesc>
    </fileDesc>
    <encodingDesc>
      <p>Transcribed using HTR Engine and OCR Multi-Engine Pipeline.</p>
    </encodingDesc>
  </teiHeader>
  <text xml:lang="${metadata.primaryLanguage.toLowerCase()}">
    <body>
`;

    folios.forEach((folio) => {
      xml += `      <pb n="${this.escapeXml(folio.folioNumber)}" facs="${this.escapeXml(folio.imageUri)}"/>\n`;
      xml += `      <div type="folio" n="${this.escapeXml(folio.folioNumber)}">\n`;
      xml += `        <p>\n`;
      xml += `          ${this.escapeXml(folio.transcribeText || 'Non-transcribed folio content')}\n`;
      xml += `        </p>\n`;
      xml += `      </div>\n`;
    });

    if (apparatusEntries && apparatusEntries.length > 0) {
      xml += `      <div type="apparatus">\n`;
      xml += `        <listApp>\n`;
      apparatusEntries.forEach((entry) => {
        xml += `          <app loc="${this.escapeXml(entry.passageRef)}">\n`;
        xml += `            <lem>${this.escapeXml(entry.lemma)}</lem>\n`;
        entry.variants.forEach((v) => {
          xml += `            <rdg wit="${this.escapeXml(v.witnesses.join(' '))}">\n`;
          xml += `              ${this.escapeXml(v.reading)}\n`;
          xml += `            </rdg>\n`;
        });
        xml += `          </app>\n`;
      });
      xml += `        </listApp>\n`;
      xml += `      </div>\n`;
    }

    xml += `    </body>
  </text>
</TEI>`;

    return xml;
  }

  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

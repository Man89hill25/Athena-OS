/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC RAG INTELLIGENCE ENGINE
 * Subsystem: Document Intelligence Loader
 * 
 * Directive: 207 (Academic RAG Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, ISO8601Timestamp } from '../foundation';
import {
  ParsedDocument,
  DocumentMetadata,
  SupportedDocumentFormat,
  AcademicLanguage,
  TEIXMLSectionMetadata,
} from './document-types';
import { DocumentChunker } from './document-chunker';

export class TextNormalizer {
  /**
   * Removes Arabic Tashkeel (diacritics) and normalizes letters (Alif, Ya, Ta Marbuta).
   */
  public static normalizeArabic(text: string): string {
    return text
      // Remove diacritics
      .replace(/[\u064B-\u0652\u0670]/g, '')
      // Normalize Alif
      .replace(/[\u0622\u0623\u0625]/g, '\u0627')
      // Normalize Ya
      .replace(/\u0649/g, '\u064A')
      // Normalize Ta Marbuta to Ha if required, or keep
      .replace(/\u0629/g, '\u0647')
      .trim();
  }

  /**
   * Normalizes ancient Greek diacritics & polytonic accents.
   */
  public static normalizePolytonicGreek(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Universal text normalizer based on language.
   */
  public static normalizeText(text: string, lang: AcademicLanguage): string {
    if (lang === 'ar') {
      return this.normalizeArabic(text);
    }
    if (lang === 'grc') {
      return this.normalizePolytonicGreek(text);
    }
    return text.toLowerCase().trim();
  }
}

export class DocumentLoader {
  /**
   * Parses raw file input (buffer/string) based on format and metadata into a structured ParsedDocument.
   */
  public static async loadDocument(
    rawInput: string | ArrayBuffer,
    format: SupportedDocumentFormat,
    partialMetadata: {
      title: string;
      primaryLanguage: AcademicLanguage;
      authors?: ReadonlyArray<{ name: string; authorityScore: number }>;
      sourceUri?: string;
    }
  ): Promise<Result<ParsedDocument, Error>> {
    try {
      const documentId = crypto.randomUUID();
      let rawText = '';
      const teiSections: Array<{ title: string; content: string; metadata: TEIXMLSectionMetadata }> = [];

      const textContent = typeof rawInput === 'string' 
        ? rawInput 
        : new TextDecoder('utf-8').decode(new Uint8Array(rawInput));

      switch (format) {
        case 'markdown':
        case 'txt':
          rawText = textContent;
          break;

        case 'tei_xml':
          rawText = this.parseTEIXML(textContent, teiSections);
          break;

        case 'pdf':
          // Extraction simulation / text wrapper for PDF stream
          rawText = this.extractPDFText(textContent);
          break;

        case 'epub':
          // Extraction simulation for EPUB container
          rawText = this.extractEPUBText(textContent);
          break;

        default:
          rawText = textContent;
      }

      const normalizedText = TextNormalizer.normalizeText(rawText, partialMetadata.primaryLanguage);

      const metadata: DocumentMetadata = {
        documentId,
        title: partialMetadata.title,
        authors: partialMetadata.authors || [{ name: 'المؤلف التراثي الأكاديمي', authorityScore: 0.9 }],
        primaryLanguage: partialMetadata.primaryLanguage,
        secondaryLanguages: [],
        format,
        tags: ['Patristic', 'Academic', 'RAG'],
        sourceUri: partialMetadata.sourceUri,
        createdAt: new Date().toISOString() as ISO8601Timestamp,
      };

      // Perform chunking
      const chunker = new DocumentChunker();
      const chunksRes = chunker.chunkDocument(documentId, rawText, metadata.primaryLanguage, {
        maxChunkSizeTokens: 400,
        overlapTokens: 50,
        preserveParagraphs: true,
        preserveTEIStructure: teiSections.length > 0,
        extractCitationAnchors: true,
      });

      if (chunksRes.isFailure) {
        return Result.fail(chunksRes.getError());
      }

      const parsedDoc: ParsedDocument = {
        metadata,
        rawText,
        normalizedText,
        chunks: chunksRes.getValue(),
        teiSections: teiSections.length > 0 ? teiSections : undefined,
      };

      return Result.ok(parsedDoc);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private static parseTEIXML(
    xmlText: string,
    teiSections: Array<{ title: string; content: string; metadata: TEIXMLSectionMetadata }>
  ): string {
    // Regex parsing for TEI XML elements (<div type="..." n="..."> <head>...</head> <p>...</p> </div>)
    const divRegex = /<div\s+type="([^"]+)"(?:\s+n="([^"]+)")?(?:\s+xml:id="([^"]+)")?>([\s\S]*?)<\/div>/gi;
    let match;
    let extractedText = '';

    while ((match = divRegex.exec(xmlText)) !== null) {
      const divType = match[1];
      const divNumber = match[2] || '';
      const xmlId = match[3] || '';
      const innerContent = match[4];

      const headMatch = /<head>([\s\S]*?)<\/head>/i.exec(innerContent);
      const headTitle = headMatch ? headMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      const cleanText = innerContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      extractedText += `\n\n=== ${divType} ${divNumber}: ${headTitle} ===\n` + cleanText;

      teiSections.push({
        title: headTitle || `${divType} ${divNumber}`,
        content: cleanText,
        metadata: {
          divType,
          divNumber,
          headTitle,
          xmlId,
        },
      });
    }

    if (!extractedText) {
      // Fallback clean XML tags
      extractedText = xmlText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    return extractedText;
  }

  private static extractPDFText(raw: string): string {
    // Strip PDF stream markers if raw PDF stream, or return textual content
    return raw.replace(/obj[\s\S]*?endobj/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private static extractEPUBText(raw: string): string {
    // Strip HTML/XHTML EPUB markup
    return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

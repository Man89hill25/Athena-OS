/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC RAG INTELLIGENCE ENGINE
 * Subsystem: Document Chunker & Citation Extractor
 * 
 * Directive: 207 (Academic RAG Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import {
  DocumentChunk,
  ChunkMetadata,
  AcademicLanguage,
  ChunkingOptions,
  CitationAnchor,
} from './document-types';
import { TextNormalizer } from './document-loader';

export class CitationExtractor {
  /**
   * Extracts academic and biblical citation anchors from text.
   * e.g., "PG 25, 120", "يوحنا 1: 1", "John 3:16", "De Incarnatione 5.1"
   */
  public static extractAnchors(text: string): ReadonlyArray<CitationAnchor> {
    const anchors: CitationAnchor[] = [];

    // Patrologia Graeca / Latina (e.g. PG 25, 120 or PL 33, 40)
    const patrologiaRegex = /\b(PG|PL|PO|CSCO)\s+(\d+)[,\s]+(\d+)\b/gi;
    let match;
    while ((match = patrologiaRegex.exec(text)) !== null) {
      anchors.push({
        workTitle: match[1].toUpperCase(),
        bookOrVolume: match[2],
        verseOrLine: match[3],
        standardRefStr: `${match[1].toUpperCase()} ${match[2]}, ${match[3]}`,
      });
    }

    // Biblical References (Arabic e.g. يوحنا 1: 1 or تكوين 3: 15)
    const arabicBibleRegex = /(يوحنا|متا|مرقس|لوقا|تكوين|خروج|رومية|كورنثوس)\s+(\d+)\s*:\s*(\d+)/gi;
    while ((match = arabicBibleRegex.exec(text)) !== null) {
      anchors.push({
        workTitle: match[1],
        chapterOrSection: match[2],
        verseOrLine: match[3],
        standardRefStr: `${match[1]} ${match[2]}:${match[3]}`,
      });
    }

    // English Biblical References
    const englishBibleRegex = /(John|Matthew|Mark|Luke|Genesis|Exodus|Romans|Corinthians)\s+(\d+)\s*:\s*(\d+)/gi;
    while ((match = englishBibleRegex.exec(text)) !== null) {
      anchors.push({
        workTitle: match[1],
        chapterOrSection: match[2],
        verseOrLine: match[3],
        standardRefStr: `${match[1]} ${match[2]}:${match[3]}`,
      });
    }

    return anchors;
  }
}

export class DocumentChunker {
  public chunkDocument(
    documentId: UUID,
    text: string,
    language: AcademicLanguage,
    options: ChunkingOptions
  ): Result<ReadonlyArray<DocumentChunk>, Error> {
    try {
      const paragraphs = options.preserveParagraphs
        ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
        : [text];

      const chunks: DocumentChunk[] = [];
      let currentChunkText = '';
      let chunkIndex = 0;
      let startCharIndex = 0;

      for (const paragraph of paragraphs) {
        const pTokens = Math.ceil(paragraph.length / 4);

        if (currentChunkText.length > 0 && Math.ceil(currentChunkText.length / 4) + pTokens > options.maxChunkSizeTokens) {
          // Flush current chunk
          chunks.push(
            this.createChunk(
              documentId,
              chunkIndex++,
              currentChunkText,
              startCharIndex,
              language,
              options
            )
          );

          // Overlap handling
          const overlapChars = options.overlapTokens * 4;
          const remainingText = currentChunkText.slice(-overlapChars);
          startCharIndex += currentChunkText.length - overlapChars;
          currentChunkText = remainingText + '\n\n' + paragraph;
        } else {
          currentChunkText = currentChunkText ? `${currentChunkText}\n\n${paragraph}` : paragraph;
        }
      }

      if (currentChunkText.trim().length > 0) {
        chunks.push(
          this.createChunk(
            documentId,
            chunkIndex++,
            currentChunkText,
            startCharIndex,
            language,
            options
          )
        );
      }

      return Result.ok(chunks);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private createChunk(
    documentId: UUID,
    chunkIndex: number,
    content: string,
    startCharIndex: number,
    language: AcademicLanguage,
    options: ChunkingOptions
  ): DocumentChunk {
    const chunkId = crypto.randomUUID();
    const normalizedContent = TextNormalizer.normalizeText(content, language);
    const endCharIndex = startCharIndex + content.length;
    const tokenCount = Math.ceil(content.length / 4);

    const citationAnchors = options.extractCitationAnchors
      ? CitationExtractor.extractAnchors(content)
      : [];

    const metadata: ChunkMetadata = {
      chunkId,
      documentId,
      chunkIndex,
      startCharIndex,
      endCharIndex,
      primaryLanguage: language,
      citationAnchors,
      extractedEntities: this.extractBasicEntities(content),
      tokenCount,
    };

    return {
      chunkId,
      documentId,
      content,
      normalizedContent,
      metadata,
      academicAuthorityScore: 0.95,
    };
  }

  private extractBasicEntities(text: string): ReadonlyArray<string> {
    const entities: string[] = [];
    const keywords = ['أثناسيوس', 'كيرلس', 'أغسطينوس', 'نيقية', 'القسطنطينية', 'أفسس', 'Athanasius', 'Cyril', 'Augustine', 'Nicaea'];
    for (const kw of keywords) {
      if (text.includes(kw)) {
        entities.push(kw);
      }
    }
    return Array.from(new Set(entities));
  }
}

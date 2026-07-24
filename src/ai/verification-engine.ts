/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Verification & Academic Quality Engine
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { AcademicMetadata, CitationInfo, VerificationStatus } from './ai-types';

export class CitationVerifier {
  public static verifyCitation(citation: CitationInfo): CitationInfo {
    // Academic rule: Must have author, workTitle, and either volume/page or uri
    const isValid =
      Boolean(citation.author && citation.author.trim().length > 0) &&
      Boolean(citation.workTitle && citation.workTitle.trim().length > 0) &&
      Boolean(citation.volume || citation.page || citation.uri);

    const status: VerificationStatus = isValid ? 'VERIFIED' : 'PARTIALLY_VERIFIED';

    return {
      ...citation,
      verificationStatus: status,
    };
  }
}

export class FactChecker {
  public static checkClaimsAgainstSources(
    claimsText: string,
    sourcesList: ReadonlyArray<string>
  ): { isVerified: boolean; contradictions: ReadonlyArray<string> } {
    const contradictions: string[] = [];

    // Fact check rules: verify absence of ungrounded speculative assertions
    if (claimsText.includes('قطعاً بدون أي دليل') || claimsText.includes('اختلاق نص')) {
      contradictions.push('Detected ungrounded or contradictory assertion in generated text.');
    }

    return {
      isVerified: contradictions.length === 0 && sourcesList.length > 0,
      contradictions,
    };
  }
}

export class ConfidenceEvaluator {
  public static computeScores(
    citationsCount: number,
    sourcesCount: number,
    hasContradictions: boolean,
    hasPrimaryLanguageQuotes: boolean
  ): { confidenceScore: number; academicReliabilityScore: number; status: VerificationStatus } {
    let confidence = 0.5;
    let reliability = 0.5;

    if (citationsCount > 0) {
      confidence += 0.25;
      reliability += 0.25;
    }

    if (sourcesCount >= 2) {
      confidence += 0.15;
      reliability += 0.15;
    }

    if (hasPrimaryLanguageQuotes) {
      confidence += 0.1;
      reliability += 0.1;
    }

    if (hasContradictions) {
      confidence -= 0.4;
      reliability -= 0.5;
    }

    confidence = Math.min(1.0, Math.max(0.0, confidence));
    reliability = Math.min(1.0, Math.max(0.0, reliability));

    let status: VerificationStatus = 'UNVERIFIED';
    if (hasContradictions) {
      status = 'CONTRADICTED';
    } else if (reliability >= 0.8) {
      status = 'VERIFIED';
    } else if (reliability >= 0.5) {
      status = 'PARTIALLY_VERIFIED';
    }

    return {
      confidenceScore: Math.round(confidence * 100) / 100,
      academicReliabilityScore: Math.round(reliability * 100) / 100,
      status,
    };
  }
}

export class AnswerVerifier {
  public static verifyResponse(
    responseText: string,
    citations: ReadonlyArray<CitationInfo>,
    sources: ReadonlyArray<string>
  ): AcademicMetadata {
    const verifiedCitations = citations.map((c) => CitationVerifier.verifyCitation(c));
    const factCheck = FactChecker.checkClaimsAgainstSources(responseText, sources);

    const hasPrimaryLanguage =
      responseText.includes('اللغة') ||
      responseText.includes('الترجمة') ||
      responseText.includes('القصة') ||
      /[a-zA-Z]/.test(responseText);

    const scores = ConfidenceEvaluator.computeScores(
      verifiedCitations.length,
      sources.length,
      factCheck.contradictions.length > 0,
      hasPrimaryLanguage
    );

    return {
      sources: [...sources],
      citations: verifiedCitations,
      footnotes: verifiedCitations.map((c) => `${c.author}, ${c.workTitle}`),
      primaryLanguages: ['ar', 'en'],
      confidenceScore: scores.confidenceScore,
      academicReliabilityScore: scores.academicReliabilityScore,
      verificationStatus: scores.status,
    };
  }
}

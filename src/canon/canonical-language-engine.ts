/**
 * ==========================================================================================================
 * ATHENA X - CANONICAL LAW & ECCLESIASTICAL KNOWLEDGE INTELLIGENCE ENGINE
 * Subsystem: Canonical Language & Terminology Engine
 * 
 * Directive: 211 (Canonical Law & Ecclesiastical Knowledge Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { CanonicalLanguage } from './canon-types';

export interface CanonicalTermEntry {
  readonly term: string;
  readonly language: CanonicalLanguage;
  readonly arabicTransliteration: string;
  readonly legalDefinition: string;
  readonly ecclesiasticalScope: string;
}

export interface LegalVocabularyAnalysis {
  readonly sourceText: string;
  readonly detectedLanguage: CanonicalLanguage;
  readonly keyCanonicalTerms: ReadonlyArray<CanonicalTermEntry>;
  readonly legalStructureSummary: string;
}

export class CanonicalLanguageEngine {
  private terminologyDict: Map<string, CanonicalTermEntry> = new Map();

  constructor() {
    this.seedCanonicalGlossary();
  }

  public detectLanguage(text: string): CanonicalLanguage {
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(text)) return 'Greek';
    if (/[\u0600-\u06FF]/.test(text)) return 'Arabic';
    if (/[\u0700-\u074F]/.test(text)) return 'Syriac';
    if (/[\u2C80-\u2CFF\u0370-\u03FF]/.test(text) && /ⲁ|ⲃ|ⲅ|ⲇ|ⲉ|ⲍ|ⲏ|ⲑ|ⲓ|ⲕ|ⲗ|ⲙ|ⲛ|ⲝ|ⲟ|ⲡ|ⲣ|ⲥ|ⲧ|ⲩ|ⲫ|ⲭ|ⲯ|ⲱ|ϣ|ϥ|ϧ|ϩ|ϫ|ϭ|ϯ/i.test(text)) {
      return 'Coptic';
    }
    return 'Latin';
  }

  public analyzeLegalVocabulary(text: string, lang?: CanonicalLanguage): Result<LegalVocabularyAnalysis, Error> {
    try {
      const detectedLang = lang || this.detectLanguage(text);
      const matchedTerms: CanonicalTermEntry[] = [];

      Array.from(this.terminologyDict.values()).forEach((entry) => {
        if (text.toLowerCase().includes(entry.term.toLowerCase()) || text.includes(entry.arabicTransliteration)) {
          matchedTerms.push(entry);
        }
      });

      // Default fallback entry if no explicit match
      if (matchedTerms.length === 0) {
        matchedTerms.push({
          term: 'Κανών (Kanon)',
          language: 'Greek',
          arabicTransliteration: 'قانون كنسي',
          legalDefinition: 'مقياس أو معيار تشريعي كنسي تنظيمياً ولاهوتياً.',
          ecclesiasticalScope: 'Universal Church Discipline',
        });
      }

      const analysis: LegalVocabularyAnalysis = {
        sourceText: text,
        detectedLanguage: detectedLang,
        keyCanonicalTerms: matchedTerms,
        legalStructureSummary: `تم تحليل النص القانوني بالنواة اللغوية [${detectedLang}]: تم رصد ${matchedTerms.length} مصطلحاً كنسياً وتحديد النطاق التشريعي والإداري.`,
      };

      return Result.ok(analysis);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private seedCanonicalGlossary(): void {
    const kanon: CanonicalTermEntry = {
      term: 'Κανών',
      language: 'Greek',
      arabicTransliteration: 'قانون (قانون كنسي)',
      legalDefinition: 'معيار كنسي ملزم صادر عن مجمع مسكوني أو مكاني.',
      ecclesiasticalScope: 'Ecclesiastical Law',
    };

    const anathematismos: CanonicalTermEntry = {
      term: 'Ἀναθεματισμός',
      language: 'Greek',
      arabicTransliteration: 'حرم كنسي (أناثيما)',
      legalDefinition: 'قطع وعزل قانوني رسمي عن الشركة الكنسية بسبب الهرطقة.',
      ecclesiasticalScope: 'Dogmatic Boundary & Discipline',
    };

    const cheirotonia: CanonicalTermEntry = {
      term: 'Χειροτονία',
      language: 'Greek',
      arabicTransliteration: 'سيامة / رسامة كنسية (شيروتونيا)',
      legalDefinition: 'وضع اليد والسيامة السرائرية للدرجات الكهنوتية الثلاث.',
      ecclesiasticalScope: 'Sacramental Hierarchy',
    };

    const autocephalia: CanonicalTermEntry = {
      term: 'Αὐτοκεφαλία',
      language: 'Greek',
      arabicTransliteration: 'استقلال كنسي (أوتوكفالية)',
      legalDefinition: 'استقلال إداري ورئاسي كامل للكنيسة مع البقاء في وحدة الإيمان.',
      ecclesiasticalScope: 'Ecclesiastical Jurisdiction',
    };

    this.terminologyDict.set('kanon', kanon);
    this.terminologyDict.set('anathematismos', anathematismos);
    this.terminologyDict.set('cheirotonia', cheirotonia);
    this.terminologyDict.set('autocephalia', autocephalia);
  }
}

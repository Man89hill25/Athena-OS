/**
 * ==========================================================================================================
 * ATHENA X - MANUSCRIPT INTELLIGENCE PLATFORM
 * Subsystem: Textual Variant Analysis & Critical Apparatus Engine
 * 
 * Directive: 208 (Manuscript Intelligence Platform)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { TextualVariant, CriticalApparatusEntry } from './manuscript-types';

export interface ManuscriptWitness {
  readonly shelfmark: string;
  readonly manuscriptTitle: string;
  readonly text: string;
}

export interface AlignmentComparisonResult {
  readonly locationRef: string;
  readonly baseText: string;
  readonly variants: ReadonlyArray<TextualVariant>;
  readonly apparatusEntries: ReadonlyArray<CriticalApparatusEntry>;
  readonly divergenceIndex: number; // 0.0 to 1.0
}

export class TextualVariantEngine {
  /**
   * Compares a base text against multiple manuscript witnesses to detect textual variants and build a Critical Apparatus.
   */
  public static compareWitnesses(
    locationRef: string,
    baseText: string,
    witnesses: ReadonlyArray<ManuscriptWitness>
  ): Result<AlignmentComparisonResult, Error> {
    try {
      const variants: TextualVariant[] = [];
      const apparatusEntries: CriticalApparatusEntry[] = [];
      const baseWords = baseText.trim().split(/\s+/);

      witnesses.forEach((witness, wIdx) => {
        const witnessWords = witness.text.trim().split(/\s+/);

        for (let i = 0; i < Math.max(baseWords.length, witnessWords.length); i++) {
          const bWord = baseWords[i] || '';
          const wWord = witnessWords[i] || '';

          if (bWord !== wWord && bWord.length > 0) {
            const variantId = crypto.randomUUID();
            const classification =
              bWord.length !== wWord.length
                ? wWord === ''
                  ? 'Omission'
                  : 'Substitution'
                : 'Orthographic';

            const variant: TextualVariant = {
              variantId,
              locationRef: `${locationRef}, word ${i + 1}`,
              baseText: bWord,
              variantText: wWord || '[حذف Omission]',
              witnessShelfmarks: [witness.shelfmark],
              classification,
            };

            variants.push(variant);

            apparatusEntries.push({
              entryId: crypto.randomUUID(),
              passageRef: locationRef,
              lemma: bWord,
              variants: [
                {
                  reading: wWord || '[حذف]',
                  witnesses: [witness.shelfmark],
                  notes: `قراءة المخطوطة (${witness.manuscriptTitle}) - نمط: ${classification}`,
                },
              ],
            });
          }
        }
      });

      const totalWords = baseWords.length || 1;
      const divergenceIndex = Number(Math.min(1.0, variants.length / totalWords).toFixed(3));

      return Result.ok({
        locationRef,
        baseText,
        variants,
        apparatusEntries,
        divergenceIndex,
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Formats critical apparatus entries into standard academic textual criticism markup.
   */
  public static formatCriticalApparatus(
    entries: ReadonlyArray<CriticalApparatusEntry>
  ): string {
    let apparatusText = `=== الجهاز النقدي للنص المخطوط (CRITICAL APPARATUS) ===\n\n`;

    entries.forEach((entry, idx) => {
      apparatusText += `${idx + 1}. [${entry.passageRef}] **${entry.lemma}** ] `;
      entry.variants.forEach((v) => {
        apparatusText += `${v.reading} *${v.witnesses.join(', ')}* (${v.notes || ''}); `;
      });
      apparatusText += `\n`;
    });

    return apparatusText;
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - PATRISTIC & THEOLOGICAL INTELLIGENCE ENGINE
 * Subsystem: Citation & Bibliography Engine
 * 
 * Directive: 209 (Patristic & Theological Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ChurchFather, PatristicWork, PatristicCitation } from './patristic-types';

export type AcademicStyle = 'Chicago' | 'APA' | 'MLA' | 'SBL';

export interface FormattedCitationOutput {
  readonly style: AcademicStyle;
  readonly footnoteStr: string;
  readonly bibliographyEntry: string;
  readonly criticalReferenceStr: string;
}

export class PatristicCitationEngine {
  /**
   * Formats a patristic citation into academic standards (Chicago, APA, MLA, SBL).
   */
  public static formatCitation(
    father: ChurchFather,
    work: PatristicWork,
    passageRef: string,
    style: AcademicStyle = 'SBL'
  ): FormattedCitationOutput {
    let footnoteStr = '';
    let bibliographyEntry = '';
    let criticalReferenceStr = '';

    const corpusRef = work.corpusRefStr || work.corpus;

    switch (style) {
      case 'Chicago':
        footnoteStr = `${father.name}, ${work.title}, ${passageRef} (${corpusRef}).`;
        bibliographyEntry = `${father.name}. ${work.title}. Edited by Patrologia Engine. ${corpusRef}.`;
        criticalReferenceStr = `${father.arabicName}، ${work.arabicTitle}، ${passageRef} (${corpusRef}).`;
        break;

      case 'APA':
        footnoteStr = `(${father.name}, ${work.century}th Cent., ${passageRef})`;
        bibliographyEntry = `${father.name}. (${work.century}th Century CE). ${work.title}. ${corpusRef}.`;
        criticalReferenceStr = `${father.arabicName} (${work.century} م)، ${work.arabicTitle}، ${passageRef}.`;
        break;

      case 'MLA':
        footnoteStr = `${father.name}, ${work.title} ${passageRef}.`;
        bibliographyEntry = `${father.name}. ${work.title}. ${corpusRef}.`;
        criticalReferenceStr = `${father.arabicName}. ${work.arabicTitle}. ${corpusRef}.`;
        break;

      case 'SBL':
      default:
        // Society of Biblical Literature Academic Standard
        footnoteStr = `${father.name}, *${work.title}* ${passageRef} (${corpusRef}).`;
        bibliographyEntry = `${father.name}. *${work.title}*. Edited and Transcribed by ATHENA X Patristic Engine. ${corpusRef}.`;
        criticalReferenceStr = `${father.arabicName}، *${work.arabicTitle}* ${passageRef} [${corpusRef}].`;
        break;
    }

    return {
      style,
      footnoteStr,
      bibliographyEntry,
      criticalReferenceStr,
    };
  }
}

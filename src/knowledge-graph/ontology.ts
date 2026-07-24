/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Academic Ontology Specifications & Schema Registry
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { OntologyCategory, RelationshipCategory } from './graph-types';

export interface OntologyClassSchema {
  readonly category: OntologyCategory;
  readonly englishTitle: string;
  readonly arabicTitle: string;
  readonly requiredProperties: ReadonlyArray<string>;
  readonly optionalProperties: ReadonlyArray<string>;
  readonly defaultRelationships: ReadonlyArray<RelationshipCategory>;
}

export class AcademicOntologyRegistry {
  private static readonly schemas: Map<OntologyCategory, OntologyClassSchema> = new Map([
    ['ChurchFather', {
      category: 'ChurchFather',
      englishTitle: 'Patristic Authors & Church Fathers Ontology',
      arabicTitle: 'أنطولوجيا الآباء الكنسيين والكتّاب الأبائيين',
      requiredProperties: ['seeTitle', 'era', 'patristicPeriod'],
      optionalProperties: ['feastDay', 'greekName', 'copticName', 'keyWorks'],
      defaultRelationships: ['Authored', 'ParticipatedIn', 'InfluencedBy', 'Opposes']
    }],
    ['Biblical', {
      category: 'Biblical',
      englishTitle: 'Scripture & Canonical Passages Ontology',
      arabicTitle: 'أنطولوجيا الأسفار والمقاطع الكتابية',
      requiredProperties: ['testament', 'book', 'chapter', 'verse'],
      optionalProperties: ['greekSeptuagint', 'hebrewMasoretic', 'pericopeTitle'],
      defaultRelationships: ['ReferencedBy', 'TransmittedThrough', 'TranslatedFrom']
    }],
    ['Council', {
      category: 'Council',
      englishTitle: 'Ecumenical & Provincial Councils Ontology',
      arabicTitle: 'أنطولوجيا المجامع المسكونية والمكانية',
      requiredProperties: ['year', 'location', 'councilType'],
      optionalProperties: ['attendeesCount', 'presidentPerson', 'keyCreedFormula'],
      defaultRelationships: ['PromulgatedAt', 'ConfirmedBy', 'Opposes']
    }],
    ['Doctrine', {
      category: 'Doctrine',
      englishTitle: 'Dogmatic & Theological Concepts Ontology',
      arabicTitle: 'أنطولوجيا العقائد والمفاهيم اللاهوتية',
      requiredProperties: ['dogmaTitle', 'technicalTermGreek'],
      optionalProperties: ['latinEquivalent', 'arabicEquivalent', 'heresyOpposed'],
      defaultRelationships: ['ConfirmedBy', 'Anatomizes', 'Opposes']
    }],
    ['CanonLaw', {
      category: 'CanonLaw',
      englishTitle: 'Ecclesiastical Canon Law Ontology',
      arabicTitle: 'أنطولوجيا القوانين والتشريعات الكنسية',
      requiredProperties: ['canonNumber', 'issuingBody'],
      optionalProperties: ['nomocanonIndex', 'subjectMatter', 'penaltyType'],
      defaultRelationships: ['PromulgatedAt', 'ReferencedBy', 'ConfirmedBy']
    }],
    ['Manuscript', {
      category: 'Manuscript',
      englishTitle: 'Manuscripts & Codex Intelligence Ontology',
      arabicTitle: 'أنطولوجيا المخطوطات والدرج الأثري',
      requiredProperties: ['shelfmark', 'holdingInstitution', 'century'],
      optionalProperties: ['scriptType', 'gregoryAlandIndex', 'material'],
      defaultRelationships: ['TransmittedThrough', 'TranslatedFrom', 'LocatedIn']
    }],
    ['HistoricalEvent', {
      category: 'HistoricalEvent',
      englishTitle: 'Ecclesiastical History Events Ontology',
      arabicTitle: 'أنطولوجيا الأحداث التاريخية الكنسية',
      requiredProperties: ['eventTitle', 'year'],
      optionalProperties: ['historicalImpact', 'primarySources'],
      defaultRelationships: ['ContemporaryWith', 'LocatedIn']
    }],
    ['Language', {
      category: 'Language',
      englishTitle: 'Linguistic & Epigraphic Languages Ontology',
      arabicTitle: 'أنطولوجيا اللغات والنصوص الأثرية',
      requiredProperties: ['languageCode', 'scriptFamily'],
      optionalProperties: ['dialect', 'literaryCorpusSize'],
      defaultRelationships: ['TranslatedFrom']
    }],
    ['Person', {
      category: 'Person',
      englishTitle: 'Historical Persons & Scribes Ontology',
      arabicTitle: 'أنطولوجيا الأشخاص التاريخيين والنُسّاخ',
      requiredProperties: ['fullName', 'role'],
      optionalProperties: ['birthYear', 'deathYear', 'biography'],
      defaultRelationships: ['ParticipatedIn', 'Authored', 'ContemporaryWith']
    }],
    ['Place', {
      category: 'Place',
      englishTitle: 'Geographic Locations & Sees Ontology',
      arabicTitle: 'أنطولوجيا المواقع الجغرافية والكراسي',
      requiredProperties: ['placeName', 'region'],
      optionalProperties: ['coordinates', 'modernName'],
      defaultRelationships: ['LocatedIn']
    }],
    ['Organization', {
      category: 'Organization',
      englishTitle: 'Monasteries & Academic Bodies Ontology',
      arabicTitle: 'أنطولوجيا الأديرة والمؤسسات الأكاديمية',
      requiredProperties: ['orgName', 'orgType'],
      optionalProperties: ['foundationCentury', 'patronSaint'],
      defaultRelationships: ['LocatedIn', 'Authored']
    }],
    ['Work', {
      category: 'Work',
      englishTitle: 'Patristic & Classical Treatises Ontology',
      arabicTitle: 'أنطولوجيا المؤلفات والرسائل اللاهوتية',
      requiredProperties: ['workTitle', 'originalLanguage'],
      optionalProperties: ['clavisPatrumNumber', 'migneVolume'],
      defaultRelationships: ['Authored', 'QuotesWork', 'ReferencedBy']
    }],
    ['Bibliography', {
      category: 'Bibliography',
      englishTitle: 'Academic Editions & Critical Apparatus Ontology',
      arabicTitle: 'أنطولوجيا النشرات العلمية والمراجع',
      requiredProperties: ['citationString', 'editorOrAuthor', 'pubYear'],
      optionalProperties: ['isbn', 'doi', 'series'],
      defaultRelationships: ['ReferencedBy', 'QuotesWork']
    }]
  ]);

  public static getSchema(category: OntologyCategory): OntologyClassSchema | undefined {
    return this.schemas.get(category);
  }

  public static getAllSchemas(): ReadonlyArray<OntologyClassSchema> {
    return Array.from(this.schemas.values());
  }
}

/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Prompt Management & Security Validator
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { PromptTemplateDefinition, TaskCategory } from './ai-types';
import { PromptInjectionError } from './ai-errors';

export interface PromptVersion {
  readonly version: string;
  readonly templateText: string;
  readonly createdAt: string;
  readonly changeSummary: string;
}

export class PromptTemplate {
  public readonly id: string;
  public readonly name: string;
  public readonly category: TaskCategory;
  public readonly variables: ReadonlyArray<string>;
  public readonly versions: ReadonlyArray<PromptVersion>;
  public readonly activeVersion: string;

  constructor(
    id: string,
    name: string,
    category: TaskCategory,
    variables: ReadonlyArray<string>,
    initialTemplate: string,
    version = '1.0.0'
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.variables = [...variables];
    this.activeVersion = version;
    this.versions = [
      {
        version,
        templateText: initialTemplate,
        createdAt: new Date().toISOString(),
        changeSummary: 'Initial prompt template release.',
      },
    ];

    Object.freeze(this.variables);
    Object.freeze(this.versions);
    Object.freeze(this);
  }

  public getActiveTemplateText(): string {
    const v = this.versions.find((ver) => ver.version === this.activeVersion);
    return v ? v.templateText : this.versions[0].templateText;
  }

  public render(variables: Record<string, string>): string {
    let text = this.getActiveTemplateText();
    for (const key of this.variables) {
      const val = variables[key] || '';
      text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }
    return text;
  }
}

export class PromptSecurityValidator {
  private static readonly INJECTION_PATTERNS = [
    /ignore\s+previous\s+instructions/i,
    /system\s+prompt\s+override/i,
    /drop\s+table/i,
    /<script.*?>/i,
    /eval\(.*?\)/i,
    /forget\s+all\s+rules/i,
    /you\s+are\s+now\s+DAN/i,
  ];

  public static validatePrompt(promptText: string): Result<void, PromptInjectionError> {
    for (const pattern of PromptSecurityValidator.INJECTION_PATTERNS) {
      if (pattern.test(promptText)) {
        return Result.fail(new PromptInjectionError(pattern.source));
      }
    }
    return Result.ok(undefined);
  }

  public static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.registerDefaultTemplates();
  }

  public registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  public getTemplate(id: string): Result<PromptTemplate, Error> {
    const template = this.templates.get(id);
    if (!template) {
      return Result.fail(new Error(`Prompt template '${id}' not found.`));
    }
    return Result.ok(template);
  }

  public renderPrompt(id: string, variables: Record<string, string>): Result<string, Error> {
    const templateResult = this.getTemplate(id);
    if (templateResult.isFailure) {
      return Result.fail(templateResult.getError());
    }

    const template = templateResult.getValue();
    const rendered = template.render(variables);

    const secCheck = PromptSecurityValidator.validatePrompt(rendered);
    if (secCheck.isFailure) {
      return Result.fail(secCheck.getError());
    }

    return Result.ok(rendered);
  }

  private registerDefaultTemplates(): void {
    this.registerTemplate(
      new PromptTemplate(
        'research_academic_synthesis',
        'Academic Research Synthesis',
        'RESEARCH',
        ['topic', 'evidenceText', 'language'],
        `أنت باحث أكاديمي متخصص في الدراسات التاريخية والتراثية. قم بتحليل موضوع: {{topic}}
بناءً على الأدلة التالية:
{{evidenceText}}
اللغة المطلوبة للتوثيق: {{language}}. قم بتقديم استنتاج محكم بالصفحة والمجلد.`
      )
    );

    this.registerTemplate(
      new PromptTemplate(
        'bible_exegesis_analysis',
        'Bible Exegesis & Verse Comparison',
        'BIBLE_EXEGESIS',
        ['verseRef', 'sourceText', 'patristicComments'],
        `قم بإجراء دراسة تفسيرية لاهوتية حرة بالشواهد والترجمات للشاهد التالي: {{verseRef}}
النص الأصلي:
{{sourceText}}
أقوال الآباء المرتبطة:
{{patristicComments}}`
      )
    );
  }
}

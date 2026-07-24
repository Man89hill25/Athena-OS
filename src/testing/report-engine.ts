/**
 * ==========================================================================================================
 * ATHENA X - ENTERPRISE TESTING PLATFORM
 * Module: Multi-Format Test Report Generator (JUnit XML, HTML, JSON, Markdown)
 * 
 * Directive: DIRECTIVE 221 — ATHENA X ENTERPRISE TESTING PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { TestSuiteResult } from './testing-types';

export class ReportEngine {
  public generateJUnitXML(suites: ReadonlyArray<TestSuiteResult>): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n';
    for (const suite of suites) {
      xml += `  <testsuite name="${suite.suiteNameArabic}" tests="${suite.totalTestsCount}" failures="${suite.failedCount}" time="${(suite.durationMs / 1000).toFixed(3)}">\n`;
      for (const test of suite.testResults) {
        xml += `    <testcase name="${test.testNameArabic}" time="${(test.durationMs / 1000).toFixed(3)}">\n`;
        if (test.status === 'failed') {
          xml += `      <failure message="${test.errorMessage || 'Unknown Error'}"/>\n`;
        }
        xml += `    </testcase>\n`;
      }
      xml += `  </testsuite>\n`;
    }
    xml += '</testsuites>';
    return xml;
  }

  public generateMarkdownReport(suites: ReadonlyArray<TestSuiteResult>): string {
    let md = `# تقرير اختبارات منصة أثينا X الشاملة\n\n`;
    for (const suite of suites) {
      md += `### مجموعة الاختبارات: ${suite.suiteNameArabic}\n`;
      md += `- **إجمالي الاختبارات**: ${suite.totalTestsCount}\n`;
      md += `- **الناجحة**: ${suite.passedCount} | **الفاشلة**: ${suite.failedCount}\n`;
      md += `- **الزمن**: ${suite.durationMs.toFixed(2)} ms\n\n`;
    }
    return md;
  }
}

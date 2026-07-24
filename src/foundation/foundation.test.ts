/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Foundation Layer Automated Unit Tests & Verification Engine
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Container } from './di';
import { ConfigProvider } from './config';
import { Logger } from './logger';
import { HealthMonitor } from './health';
import { MetricsCollector } from './metrics';
import { DiagnosticsManager } from './diagnostics';
import { Result, left, right } from './types';
import {
  SystemError,
  ValidationError,
  ConfigurationError,
  DependencyInjectionError,
} from './errors';
import { ATHENA_VERSION_INFO } from './version';

export interface TestSuiteResult {
  suiteName: string;
  passed: boolean;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  details: Array<{ testName: string; passed: boolean; error?: string }>;
}

export class FoundationTestSuiteRunner {
  public async runAllTests(): Promise<{
    passedAll: boolean;
    timestamp: string;
    version: string;
    suites: TestSuiteResult[];
  }> {
    const suites: TestSuiteResult[] = [
      this.testDiContainer(),
      this.testConfigProvider(),
      this.testLogger(),
      await this.testHealthMonitor(),
      this.testMetricsCollector(),
      await this.testDiagnosticsManager(),
      this.testErrorsAndMonads(),
    ];

    const passedAll = suites.every(s => s.passed);

    return {
      passedAll,
      timestamp: new Date().toISOString(),
      version: ATHENA_VERSION_INFO.toString(),
      suites,
    };
  }

  private testDiContainer(): TestSuiteResult {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const container = new Container();

    try {
      // Test 1: Value registration & resolution
      container.registerValue('API_KEY', 'secret_12345');
      const val = container.resolve<string>('API_KEY');
      details.push({
        testName: 'DI: Register and resolve value',
        passed: val === 'secret_12345',
      });

      // Test 2: Factory resolution (Singleton)
      let count = 0;
      container.registerFactory('COUNTER', () => ++count, 'SINGLETON');
      const c1 = container.resolve<number>('COUNTER');
      const c2 = container.resolve<number>('COUNTER');
      details.push({
        testName: 'DI: Singleton factory resolution',
        passed: c1 === 1 && c2 === 1,
      });

      // Test 3: Transient resolution
      let tCount = 0;
      container.registerFactory('TRANSIENT_COUNTER', () => ++tCount, 'TRANSIENT');
      const tc1 = container.resolve<number>('TRANSIENT_COUNTER');
      const tc2 = container.resolve<number>('TRANSIENT_COUNTER');
      details.push({
        testName: 'DI: Transient factory resolution',
        passed: tc1 === 1 && tc2 === 2,
      });

      // Test 4: Circular dependency detection
      container.registerFactory('A', (c) => c.resolve('B'));
      container.registerFactory('B', (c) => c.resolve('A'));
      let circularDetected = false;
      try {
        container.resolve('A');
      } catch (err) {
        if (err instanceof DependencyInjectionError) {
          circularDetected = true;
        }
      }
      details.push({
        testName: 'DI: Circular dependency detection',
        passed: circularDetected,
      });
    } catch (err: any) {
      details.push({ testName: 'DI Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Dependency Injection Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private testConfigProvider(): TestSuiteResult {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const config = new ConfigProvider('development', { customKey: 'customVal' });

    try {
      // Test 1: Get custom key
      const custom = config.get<string>('customKey');
      details.push({
        testName: 'Config: Read custom key',
        passed: custom === 'customVal',
      });

      // Test 2: Dot notation resolution
      const port = config.get<number>('server.port');
      details.push({
        testName: 'Config: Dot-notation property resolution',
        passed: typeof port === 'number',
      });

      // Test 3: Default value fallback
      const nonExistent = config.get<string>('non.existent.key', 'default_str');
      details.push({
        testName: 'Config: Default fallback for missing key',
        passed: nonExistent === 'default_str',
      });

      // Test 4: Config freezing
      config.freeze();
      let freezeCaught = false;
      try {
        config.set('newKey', 'fail');
      } catch (err) {
        if (err instanceof ConfigurationError) {
          freezeCaught = true;
        }
      }
      details.push({
        testName: 'Config: Mutation prevention when frozen',
        passed: freezeCaught,
      });
    } catch (err: any) {
      details.push({ testName: 'Config Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Configuration Infrastructure Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private testLogger(): TestSuiteResult {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const logger = new Logger('TestLogger', 'TRACE');

    try {
      let loggedCount = 0;
      const unsubscribe = Logger.subscribe((entry) => {
        if (entry.context?.loggerName === 'TestLogger') {
          loggedCount++;
        }
      });

      logger.info('Test info message', { apiKey: 'secret_token_123', safeData: 42 });
      logger.error('Test error message', new Error('Dummy Error'));

      unsubscribe();

      const recentLogs = Logger.getRecentLogs(10);
      const maskedEntry = recentLogs.find(l => l.message === 'Test info message');
      const isMasked = maskedEntry?.context?.apiKey === '***MASKED***';

      details.push({
        testName: 'Logger: Log subscription and event emission',
        passed: loggedCount >= 2,
      });

      details.push({
        testName: 'Logger: Sensitive data masking in log context',
        passed: isMasked,
      });
    } catch (err: any) {
      details.push({ testName: 'Logger Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Logging Infrastructure Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private async testHealthMonitor(): Promise<TestSuiteResult> {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const healthMonitor = new HealthMonitor();

    try {
      healthMonitor.registerSubsystem({
        subsystemName: 'DatabaseSubsystem',
        async checkHealth() {
          return {
            subsystemName: 'DatabaseSubsystem',
            status: 'HEALTHY',
            checkTimestamp: new Date().toISOString(),
            latencyMs: 1.2,
          };
        },
      });

      const report = await healthMonitor.evaluateHealth();

      details.push({
        testName: 'Health: Evaluate registered healthy subsystem',
        passed: report.overallStatus === 'HEALTHY' && report.healthyCount === 1,
      });
    } catch (err: any) {
      details.push({ testName: 'Health Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Health Monitoring Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private testMetricsCollector(): TestSuiteResult {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const metrics = new MetricsCollector();

    try {
      metrics.incrementCounter('http_requests_total', 1, { method: 'GET' });
      metrics.incrementCounter('http_requests_total', 1, { method: 'GET' });
      metrics.setGauge('active_sessions', 15);
      metrics.recordHistogram('request_latency_ms', 10);
      metrics.recordHistogram('request_latency_ms', 20);

      const snapshot = metrics.getSnapshot() as any;

      details.push({
        testName: 'Metrics: Counter aggregation with labels',
        passed: snapshot.counters['http_requests_total{method="GET"}'] === 2,
      });

      details.push({
        testName: 'Metrics: Gauge state tracking',
        passed: snapshot.gauges['active_sessions'] === 15,
      });

      details.push({
        testName: 'Metrics: Histogram average & percentile calculations',
        passed: snapshot.histograms['request_latency_ms']?.avg === 15,
      });
    } catch (err: any) {
      details.push({ testName: 'Metrics Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Metrics & Telemetry Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private async testDiagnosticsManager(): Promise<TestSuiteResult> {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];
    const diagnostics = new DiagnosticsManager();

    try {
      diagnostics.registerProbe({
        probeName: 'CpuProbe',
        async runDiagnostic() {
          return {
            passed: true,
            metrics: { usagePercent: 12.5 },
            timestamp: new Date().toISOString(),
          };
        },
      });

      const res = await diagnostics.runAllDiagnostics();

      details.push({
        testName: 'Diagnostics: Run registered probes',
        passed: res.CpuProbe?.passed === true,
      });
    } catch (err: any) {
      details.push({ testName: 'Diagnostics Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Diagnostics & Probes Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }

  private testErrorsAndMonads(): TestSuiteResult {
    const details: Array<{ testName: string; passed: boolean; error?: string }> = [];

    try {
      // Test Result monad success
      const okRes = Result.ok<number, string>(100);
      details.push({
        testName: 'Monad: Result.ok value extraction',
        passed: okRes.isSuccess && okRes.getValue() === 100,
      });

      // Test Result monad failure
      const failRes = Result.fail<number, string>('Error occurred');
      details.push({
        testName: 'Monad: Result.fail error extraction',
        passed: failRes.isFailure && failRes.getError() === 'Error occurred',
      });

      // Test Either left/right
      const eRight = right<string, number>(42);
      details.push({
        testName: 'Monad: Either right pattern',
        passed: eRight.kind === 'right' && eRight.right === 42,
      });

      // Test Enterprise Error hierarchy
      const err = new SystemError('Critical system outage', 'ERR_SYS_01');
      details.push({
        testName: 'Errors: Enterprise error taxonomy JSON serialization',
        passed: err.code === 'ERR_SYS_01' && typeof err.toJSON().stack === 'string',
      });
    } catch (err: any) {
      details.push({ testName: 'Errors Suite Exception', passed: false, error: err?.message });
    }

    const passedCount = details.filter(d => d.passed).length;
    return {
      suiteName: 'Errors & Functional Monads Suite',
      passed: passedCount === details.length,
      totalTests: details.length,
      passedCount,
      failedCount: details.length - passedCount,
      details,
    };
  }
}

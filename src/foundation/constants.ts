/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Global System Constants
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

export const ATHENA_CONSTANTS = {
  SYSTEM: {
    NAME: 'Athena X Academic OS',
    ACRONYM: 'ATHENA-X',
    PORT_DEFAULT: 3000,
    HOST_DEFAULT: '0.0.0.0',
    MAX_MEMORY_MB: 8192,
    DEFAULT_LOCALE: 'ar',
    FALLBACK_LOCALE: 'en',
    TIMEZONE: 'UTC',
  },

  DIAGNOSTICS: {
    HEALTH_CHECK_INTERVAL_MS: 30000,
    METRICS_SNAPSHOT_INTERVAL_MS: 60000,
    MEMORY_THRESHOLD_WARNING_PERCENT: 80,
    MEMORY_THRESHOLD_CRITICAL_PERCENT: 95,
  },

  LOGGING: {
    DEFAULT_LEVEL: 'INFO',
    MAX_LOG_BUFFER_SIZE: 1000,
    MASK_KEYS: ['password', 'apiKey', 'token', 'secret', 'auth', 'privateKey'],
  },

  SECURITY: {
    TOKEN_EXPIRATION_HOURS: 24,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
    CORS_MAX_AGE_SECONDS: 86400,
  },

  SEARCH: {
    MAX_QUERY_LENGTH: 500,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MIN_SEARCH_SCORE: 0.15,
    RRF_K_CONSTANT: 60,
  },

  STORAGE: {
    MAX_CACHE_ITEMS: 10000,
    DEFAULT_TTL_SECONDS: 3600,
  }
} as const;

export type SystemConstants = typeof ATHENA_CONSTANTS;

/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC DESKTOP PLATFORM
 * Module: UI Theme Engine (Dark, Light, Academic Sepia & High Contrast)
 * 
 * Directive: DIRECTIVE 216 — ATHENA X ACADEMIC DESKTOP PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { UIThemeMode } from './desktop-types';

export interface ThemeCssVariables {
  readonly bgPrimary: string;
  readonly textPrimary: string;
  readonly borderAccent: string;
  readonly cardBg: string;
}

export class ThemeEngine {
  private activeThemeMode: UIThemeMode = 'dark';

  public setTheme(mode: UIThemeMode): Result<ThemeCssVariables, Error> {
    this.activeThemeMode = mode;
    return Result.ok(this.getThemeVariables(mode));
  }

  public getActiveThemeMode(): Result<UIThemeMode, Error> {
    return Result.ok(this.activeThemeMode);
  }

  public getThemeVariables(mode: UIThemeMode): ThemeCssVariables {
    switch (mode) {
      case 'light':
        return { bgPrimary: '#ffffff', textPrimary: '#0f172a', borderAccent: '#cbd5e1', cardBg: '#f8fafc' };
      case 'academic_sepia':
        return { bgPrimary: '#fbf0d9', textPrimary: '#2d241e', borderAccent: '#d4c5a9', cardBg: '#f4e4c1' };
      case 'contrast':
        return { bgPrimary: '#000000', textPrimary: '#ffffff', borderAccent: '#ffff00', cardBg: '#111111' };
      case 'dark':
      default:
        return { bgPrimary: '#090d16', textPrimary: '#f1f5f9', borderAccent: '#1e293b', cardBg: '#0f172a' };
    }
  }
}

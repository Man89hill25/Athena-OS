/**
 * ==========================================================================================================
 * ATHENA X - RELEASE & INSTALLER ENGINE
 * Module: Release Test Suite & Full Matrix Diagnostics
 * 
 * Directive: DIRECTIVE 220 — ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ReleaseVerificationEngine, ReleaseVerificationReport } from './verification';
import { PackagingEngine } from './packaging-engine';
import { SigningEngine } from './signing-engine';
import { LicenseEngine } from './license-engine';

export class ReleaseTestSuite {
  public static async runAllTests(): Promise<{
    verification: ReleaseVerificationReport;
    allFormatsSupportedCount: number;
    signingVerified: boolean;
    licenseVerified: boolean;
    totalPassed: boolean;
  }> {
    const verifier = new ReleaseVerificationEngine();
    const verReportRes = await verifier.verifyReleasePipeline();
    const verReport = verReportRes.getValue();

    const packaging = new PackagingEngine();
    const winMsi = packaging.createPackage('windows', 'msi', '3.5.0');
    const winExe = packaging.createPackage('windows', 'exe', '3.5.0');
    const winPort = packaging.createPackage('windows', 'portable', '3.5.0');
    const linApp = packaging.createPackage('linux', 'appimage', '3.5.0');
    const linDeb = packaging.createPackage('linux', 'deb', '3.5.0');
    const linRpm = packaging.createPackage('linux', 'rpm', '3.5.0');
    const linFlat = packaging.createPackage('linux', 'flatpak', '3.5.0');
    const linSnap = packaging.createPackage('linux', 'snap', '3.5.0');
    const macDmg = packaging.createPackage('macos', 'dmg', '3.5.0');
    const macPkg = packaging.createPackage('macos', 'pkg', '3.5.0');

    const signing = new SigningEngine();
    const signedWin = signing.signArtifact(winMsi.getValue());

    const license = new LicenseEngine();
    const licRes = license.validateLicenseKey('ATHENA-SOVEREIGN-KEY-2045');

    const formatsPassed =
      winMsi.isSuccess && winExe.isSuccess && winPort.isSuccess &&
      linApp.isSuccess && linDeb.isSuccess && linRpm.isSuccess && linFlat.isSuccess && linSnap.isSuccess &&
      macDmg.isSuccess && macPkg.isSuccess;

    const signingVerified = signedWin.isSuccess && signedWin.getValue().isCodeSigned;
    const licenseVerified = licRes.isSuccess && licRes.getValue().isValid;

    return {
      verification: verReport,
      allFormatsSupportedCount: 10,
      signingVerified,
      licenseVerified,
      totalPassed: verReport.passed && formatsPassed && signingVerified && licenseVerified
    };
  }
}

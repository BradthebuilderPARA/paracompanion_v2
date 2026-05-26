/**
 * ParaCompanion Clinical Logic Engine
 * Phase 2: Clinical Core
 * 
 * Objectives: Zero dependencies, Offline-safe, JRCALC/NICE/RCP NEWS2 v2 aligned.
 */

export type SpO2Scale = 'scale1' | 'scale2';
export type Consciousness = 'A' | 'C' | 'V' | 'P' | 'U';

export interface NEWS2Params {
  respirationRate: number;
  spO2: number;
  spO2Scale: SpO2Scale;
  airOrOxygen: 'air' | 'oxygen';
  systolicBP: number;
  diastolicBP?: number; // Not scored but mandatory for clinical record
  pulseRate: number;
  consciousness: Consciousness;
  temperature: number;
  bloodGlucose?: number; // BM - Not scored but visible in overview
  gcs?: {
    eye: number; // 1-4
    verbal: number; // 1-5
    motor: number; // 1-6
    total: number; // 3-15
  };
}

export interface NEWS2Result {
  score: number;
  riskLevel: 'low' | 'low-medium' | 'medium' | 'high';
  parameterScores: Record<keyof NEWS2Params, number>;
  recommendedAction: string;
}

export interface PatientDemographics {
  age: number; // Legacy: Maps to ageYears for adult/paed (if ageUnit='years')
  ageUnit: 'months' | 'years';
  ageYears?: number; // v1.3
  ageMonths?: number; // v1.3
  sex: 'Male' | 'Female' | 'Other';
  weight?: number;
  pregnant: boolean;
  isPostpartum?: boolean;
  gestationWeeks?: number;
  postpartumHours?: number;
  presentingProblem?: string[];
  allergies?: string[];
  antithrombotics?: string[];
}

export interface ClinicalSession<V = unknown, R = unknown> {
  id: string;
  startTime: string;
  lastHeartbeat: string;
  toolId: string; // v1.3: Reference to clinical_tools table
  toolType: string; // Legacy: NEWS2, PEWS, etc.
  toolVersionAtTime: string; // Snapshotted at creation
  observationsSchemaVersion: string;
  scoresSchemaVersion: string;
  sessionSource: 'manual' | 'arrival_mode' | 'crew_shared';
  demographics: PatientDemographics;
  observations: Array<{
    timestamp: string;
    vitals: V;
    result: R;
  }>;
  completedAt?: string; // Null if active
}

/**
 * Known Standard Clinical Tool IDs (v1.3 Constants)
 * Hardcoded to match the master seed in migration 20260326000004
 */
export const CLINICAL_TOOL_IDS = {
  NEWS2: 'news2', // In practice, these transition to UUIDs once fetched from DB
  PEWS: 'pews',
  MOEWS: 'meows',
  STROKE: 'stroke',
  TRAUMA: 'trauma',
  ARREST: 'arrest',
  HANDOVER: 'handover'
} as const;


export type MOEWSFlag = 'green' | 'amber' | 'red';

export interface MOEWSRedFlags {
  // < 20 weeks
  shoulderTipPain?: boolean;
  pvLossLessThan20wks?: boolean; // Renamed for UI alignment
  // >= 20 weeks
  stickyPinkPlug?: boolean; // Renamed
  clearFluid?: boolean; // Renamed
  freshRedBleeding?: boolean;
  bloodStainedAmniotic?: boolean;
  meconiumOffensiveWaters?: boolean; // Renamed
  watersBrokenLessThan37w?: boolean; // Renamed
  // Postpartum
  padSoakedLessThan30min?: boolean; // Renamed
  offensiveLochia?: boolean;
  // Pre-eclampsia
  severeHeadache?: boolean;
  visualDisturbances?: boolean;
  epigastricPain?: boolean; // Renamed from subcostalPain
  suddenOedema?: boolean;
  seizure?: boolean;
  // General
  looksUnwell?: boolean;
}

export interface MOEWSParams {
  respirationRate: number;
  spO2: number;
  onOxygen: boolean;
  systolicBP: number;
  diastolicBP: number;
  pulseRate: number;
  temperature: number;
  acvpu: 'A' | 'C' | 'V' | 'P' | 'U'; // Renamed from consciousness
  painScore?: number; // 0-10
  isPostpartum?: boolean;
  postpartumHours?: number;
  gestationWeeks?: number;
  redFlags: MOEWSRedFlags;
}

export interface MOEWSResult {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  parameterScores: Record<string, number>; 
  flags: Record<string, MOEWSFlag>;
  isCritical: boolean; 
  isTimeCritical: boolean; 
  recommendedAction: string;
}

/**
 * Lead Clinical Project Auditor Note:
 * This implementation follows the Royal College of Physicians (RCP) NEWS2 v2 chart exactly.
 * Use Scale 2 for patients with hypercapnic respiratory failure (e.g. COPD).
 */
export function calculateNEWS2(params: NEWS2Params): NEWS2Result {
  const scores: Record<string, number> = {};

  // 1. Respiration Rate
  if (params.respirationRate <= 8 || params.respirationRate >= 25) scores.respirationRate = 3;
  else if (params.respirationRate >= 21 && params.respirationRate <= 24) scores.respirationRate = 2;
  else if (params.respirationRate >= 9 && params.respirationRate <= 11) scores.respirationRate = 1;
  else scores.respirationRate = 0;

  // 2. SpO2
  if (params.spO2Scale === 'scale1') {
    if (params.spO2 <= 91) scores.spO2 = 3;
    else if (params.spO2 <= 93) scores.spO2 = 2;
    else if (params.spO2 <= 95) scores.spO2 = 1;
    else scores.spO2 = 0;
  } else {
    // Scale 2: Targeted at 88-92%
    if (params.spO2 <= 83) scores.spO2 = 3;
    else if (params.spO2 <= 85) scores.spO2 = 2;
    else if (params.spO2 <= 87) scores.spO2 = 1;
    else if (params.spO2 >= 93 && params.airOrOxygen === 'oxygen') {
      if (params.spO2 >= 97) scores.spO2 = 3;
      else if (params.spO2 >= 95) scores.spO2 = 2;
      else scores.spO2 = 1;
    } else {
      scores.spO2 = 0;
    }
  }

  // 3. Air or Oxygen
  scores.airOrOxygen = params.airOrOxygen === 'oxygen' ? 2 : 0;

  // 4. Systolic BP
  if (params.systolicBP <= 90 || params.systolicBP >= 220) scores.systolicBP = 3;
  else if (params.systolicBP <= 100) scores.systolicBP = 2;
  else if (params.systolicBP <= 110) scores.systolicBP = 1;
  else scores.systolicBP = 0;

  // 5. Pulse Rate
  if (params.pulseRate <= 40 || params.pulseRate >= 131) scores.pulseRate = 3;
  else if (params.pulseRate >= 111 && params.pulseRate <= 130) scores.pulseRate = 2;
  else if (params.pulseRate >= 41 && params.pulseRate <= 50) scores.pulseRate = 1;
  else if (params.pulseRate >= 91 && params.pulseRate <= 110) scores.pulseRate = 1;
  else scores.pulseRate = 0;

  // 6. Consciousness (ACVPU)
  // 'A' is 0, others ('C', 'V', 'P', 'U') are 3
  scores.consciousness = params.consciousness === 'A' ? 0 : 3;

  // 7. Temperature
  if (params.temperature <= 35.0) scores.temperature = 3;
  else if (params.temperature >= 39.1) scores.temperature = 2;
  else if (params.temperature >= 35.1 && params.temperature <= 36.0) scores.temperature = 1;
  else if (params.temperature >= 38.1 && params.temperature <= 39.0) scores.temperature = 1;
  else scores.temperature = 0;

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  let riskLevel: NEWS2Result['riskLevel'] = 'low';
  let recommendedAction = 'Ward-based response';

  const hasScoreOf3 = Object.values(scores).some(s => s === 3);

  if (totalScore >= 7) {
    riskLevel = 'high';
    recommendedAction = 'Emergency assessment by a response team with critical care skills';
  } else if (totalScore >= 5 || hasScoreOf3) {
    riskLevel = 'medium';
    recommendedAction = 'Urgent assessment by a clinician skilled in assessing acute illness';
  } else if (totalScore >= 1) {
    riskLevel = 'low-medium';
    recommendedAction = 'Routine assessment by a registered nurse';
  }

  return {
    score: totalScore,
    riskLevel,
    parameterScores: scores as unknown as Record<keyof NEWS2Params, number>,
    recommendedAction,
  };
}

export function calculateGCS(eye: number, verbal: number, motor: number): number {
  return Math.min(15, Math.max(3, eye + verbal + motor));
}

// Removed PEWS functions; replaced by Paediatric Assessment

export function calculateMOEWS(params: MOEWSParams): MOEWSResult {
  const flags: Record<string, MOEWSFlag> = {};
  const parameterScores: Record<string, number> = {};

  // 1. Respiratory Rate
  const rr = params.respirationRate;
  if (rr < 7 || rr > 24) flags.respirationRate = 'red';
  else if (rr === 7 || rr === 8 || rr === 22 || rr === 23 || rr === 24) flags.respirationRate = 'amber';
  else flags.respirationRate = 'green';

  // 2. SpO2
  const spo2 = params.spO2;
  if (spo2 < 93) flags.spO2 = 'red';
  else if (spo2 === 93 || spo2 === 94) flags.spO2 = 'amber';
  else flags.spO2 = 'green';

  // 3. Supplemental O2
  if (params.onOxygen) flags.oxygenSupport = 'amber';
  else flags.oxygenSupport = 'green';

  // 4. Systolic BP
  const sbp = params.systolicBP;
  if (sbp < 94 || sbp > 144) flags.systolicBP = 'red';
  else if ((sbp >= 94 && sbp <= 100) || (sbp >= 136 && sbp <= 144)) flags.systolicBP = 'amber';
  else flags.systolicBP = 'green';

  // 5. Diastolic BP
  const dbp = params.diastolicBP;
  if (dbp < 57 || dbp > 96) flags.diastolicBP = 'red';
  else if ((dbp >= 57 && dbp <= 61) || (dbp >= 89 && dbp <= 96)) flags.diastolicBP = 'amber';
  else flags.diastolicBP = 'green';

  // 6. Pulse Rate
  const hr = params.pulseRate;
  const hoursPostpartum = params.postpartumHours || 0;
  const isEarlyPostpartum = params.isPostpartum && hoursPostpartum <= 48;
  const isPregAndEarly = !params.isPostpartum || isEarlyPostpartum;

  if (isPregAndEarly) {
    if (hr < 63 || hr > 121) flags.pulseRate = 'red';
    else if ((hr >= 63 && hr <= 70) || (hr >= 113 && hr <= 121)) flags.pulseRate = 'amber';
    else flags.pulseRate = 'green';
  } else {
    if (hr < 51 || hr > 107) flags.pulseRate = 'red';
    else if ((hr >= 51 && hr <= 57) || (hr >= 99 && hr <= 107)) flags.pulseRate = 'amber';
    else flags.pulseRate = 'green';
  }

  // 7. Temperature
  const temp = params.temperature;
  if (temp < 35.7 || temp > 37.4) flags.temperature = 'red';
  else if ((temp >= 35.7 && temp <= 36.1) || (temp >= 37.3 && temp <= 37.4)) flags.temperature = 'amber';
  else flags.temperature = 'green';

  // 8. ACVPU
  const acvpu = params.acvpu;
  flags.acvpu = (acvpu === 'A' || !acvpu) ? 'green' : 'red';

  Object.keys(flags).forEach(key => {
    parameterScores[key] = flags[key] === 'red' ? 3 : (flags[key] === 'amber' ? 2 : 0);
  });

  const hasRedFlagSymptom = Object.values(params.redFlags).some(v => v === true);
  const score = Object.values(parameterScores).reduce((a, b) => a + b, 0);
  const hasScoreOf3 = Object.values(parameterScores).some(s => s === 3);
  const amberCount = Object.values(parameterScores).filter(s => s === 2).length;

  const isCritical = hasScoreOf3 || hasRedFlagSymptom;
  const isTimeCritical = isCritical || amberCount >= 2;

  let riskLevel: MOEWSResult['riskLevel'] = 'low';
  if (score >= 7) riskLevel = 'high';
  else if (score >= 5) riskLevel = 'medium';

  return {
    score,
    riskLevel,
    parameterScores,
    flags,
    isCritical,
    isTimeCritical,
    recommendedAction: getMOEWSAction(score, isCritical, isTimeCritical),
  };
}

function getMOEWSAction(score: number, isCritical: boolean, isTimeCritical: boolean): string {
  if (isTimeCritical || score >= 7) return 'EMERGENCY response; immediate pre-alert to obstetric team';
  if (score >= 5) return 'Consider obstetric review; escalate per protocol';
  if (isCritical) return 'URGENT assessment; Red Banner flash';
  return 'Routine assessment; continue monitoring';
}

export * from './stroke/types';
export * from './stroke/logic';
export * from './references/antithrombotics';

export const CLINICAL_METADATA = {
  version: '1.3.0',
  standard: 'RCP NEWS2 v2 & National PEWS Framework',
  lastVerified: '2026-03-26',
};

export * from './src/auth/profile-mapper';
export * from './src/legal/policies';
export * from './afc/calculator';
export * from './arrest/types';
export * from './arrest/logic';
export * from './falls/types';
export * from './falls/logic';
export * from './mental-health/types';
export * from './mental-health/logic';
export * from './trauma/types';
export * from './trauma/logic';
export * from './history/types';
export * from './history/data';
export * from './history/logic';
export * from './handover';
export * from './cpd/logic';
export * from './paediatric-assessment/types';
export * from './paediatric-assessment/logic';

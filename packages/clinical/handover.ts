import { 
  NEWS2Result, 
  PaediatricAssessmentResult, 
  MOEWSResult, 
  NEWS2Params,
  PaediatricAssessmentParams,
  MOEWSParams,
  PatientDemographics,
  ClinicalSession,
  StrokeParams,
  FallsAssessment,
  MentalHealthSession,
  TraumaSessionState,
  ATMISTER
} from './index';
import { ArrestSessionState } from './arrest/types';

export interface HandoverAggregate {
  headline: string;
  eta: string;
  isPreAlertRequired: boolean;
  atmister: ATMISTER;
  vitals: {
    arrival?: NEWS2Result | PaediatricAssessmentResult | MOEWSResult;
    latest?: NEWS2Result | PaediatricAssessmentResult | MOEWSResult;
  };
  redFlags: string[];
  allergies: string[];
  antithrombotics: string[];
}

export interface ClinicalState {
  activeSession?: ClinicalSession<NEWS2Params | PaediatricAssessmentParams | MOEWSParams, NEWS2Result | PaediatricAssessmentResult | MOEWSResult> | null;
  arrestSession?: ArrestSessionState | null;
  strokeSession?: StrokeParams | null;
  traumaSession?: TraumaSessionState | null;
  fallsSession?: FallsAssessment | null;
  mentalHealthSession?: MentalHealthSession | null;
}

/**
 * Pre-Alert Trigger Logic (JRCALC 2025 / NICE Guidelines)
 */
export function shouldTriggerPreAlert(state: ClinicalState): boolean {
  const latestVitals = state.activeSession?.observations[state.activeSession.observations.length - 1]?.result;
  
  // 1. Altered Physiology (Adults - NEWS2)
  if (latestVitals && typeof latestVitals === 'object' && 'score' in latestVitals && !('ageBand' in latestVitals) && !('flags' in latestVitals)) {
    const v = latestVitals as NEWS2Result;
    if (v.score >= 5) return true;
    const p = v.parameterScores as Record<string, number>;
    if (Object.values(p).some(s => s === 3)) return true;
  }

  // 2. Altered Physiology (Children - Paediatric Assessment)
  if (latestVitals && typeof latestVitals === 'object' && 'trafficLight' in latestVitals) {
    const v = latestVitals as PaediatricAssessmentResult;
    if (v.trafficLight === 'red') return true;
  }

  // 3. Specific Conditions
  if (state.arrestSession) return true;
  
  // Stroke FAST Check
  if (state.strokeSession) {
    const s = state.strokeSession.symptoms;
    if (s.facialDroop || s.armWeakness || s.speechDifficulties) return true;
  }

  if (state.traumaSession && (state.traumaSession.primarySurvey.disability.gcs.total < 13)) return true;
  
  if (state.mentalHealthSession && state.mentalHealthSession.fourAT && state.mentalHealthSession.fourAT.alertness !== null && state.mentalHealthSession.fourAT.alertness > 0) return true;

  return false;
}

/**
 * Aggregates all clinical module data into a unified ATMISTER handover.
 */
export function aggregateHandoverData(state: ClinicalState, manualEta: string = 'TBC'): HandoverAggregate {
  const demo = state.activeSession?.demographics;
  const observations = state.activeSession?.observations || [];
  const arrival = observations[0]?.result;
  const latest = observations[observations.length - 1]?.result;

  const redFlags: string[] = [];
  
  if (state.strokeSession) {
    const s = state.strokeSession.symptoms;
    if (s.facialDroop || s.armWeakness || s.speechDifficulties) redFlags.push('FAST+ Stroke');
  }

  if (state.traumaSession?.primarySurvey.catastrophicHaemorrhage.present) redFlags.push('Major Haemorrhage');

  // Medical vs Trauma Mapping
  const isTrauma = !!state.traumaSession;
  const mechanism = isTrauma ? state.traumaSession?.scene.mechanism : (state.activeSession?.demographics.presentingProblem?.[0] || 'Unknown Medical');
  const injuries = isTrauma ? state.traumaSession?.primarySurvey.exposure.wounds.join(', ') : 'Medical History TBC';

  const atmister: ATMISTER = {
    ageSex: `${demo?.ageYears ?? demo?.age}${demo?.ageMonths !== undefined ? 'mo' : (demo?.ageUnit === 'years' ? 'yo' : 'mo')} ${demo?.sex}`,
    timeOfIncident: state.activeSession?.startTime || 'Unknown',
    mechanism: String(mechanism),
    injuries: String(injuries),
    signs: (latest && typeof latest === 'object' && 'score' in latest) ? `Score: ${(latest as {score: number}).score}` : 'Vitals Pending',
    treatment: 'Standard Care',
    eta: manualEta,
    requirements: shouldTriggerPreAlert(state) ? 'URGENT RESUS / SENIOR REVIEW' : 'Triage'
  };

  return {
    headline: `${isTrauma ? 'TRAUMA' : 'MEDICAL'} ALERT: ${mechanism} - ETA ${manualEta}`,
    eta: manualEta,
    isPreAlertRequired: shouldTriggerPreAlert(state),
    atmister,
    vitals: { arrival, latest },
    redFlags,
    allergies: demo?.allergies || [],
    antithrombotics: demo?.antithrombotics || []
  };
}

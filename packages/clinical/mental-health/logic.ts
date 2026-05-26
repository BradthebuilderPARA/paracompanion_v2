import { PatientDemographics } from '../index';
import { MentalHealthSession, FourATState, MHRiskLevel, MHResult, MentalHealthRisk, ABSMState, FullMSEState } from './types';

/**
 * 4AT Scoring Algorithm
 * Scored from 0-12
 */
export function calculate4ATScore(state: FourATState): number {
  let score = 0;

  // 1. Alertness
  if (state.alertness !== null) score += state.alertness;

  // 2. AMT4
  if (state.amt4) {
    const mistakes = Object.values(state.amt4).filter(v => v === false).length;
    if (mistakes === 1) score += 1;
    else if (mistakes >= 2) score += 2;
  }

  // 3. Attention
  if (state.attention !== null) score += state.attention;

  // 4. Acute Change
  if (state.acuteChange !== null) score += state.acuteChange;

  return score;
}

/**
 * Mental Health Risk Calculation logic
 * Stratifies risk into 🔴 HIGH, 🟠 MODERATE, 🟢 LOW
 */
export function calculateMHRisk(session: MentalHealthSession): MHResult {
  const alerts: string[] = [];
  let riskLevel: MHRiskLevel = 'low';

  const fourATScore = calculate4ATScore(session.fourAT);
  const isDeliriumPossible = fourATScore >= 4;

  if (isDeliriumPossible) {
    alerts.push('URGENT: Possible Delirium (+/- cognitive impairment) identified via 4AT.');
    riskLevel = 'high'; // Delirium is a medical emergency
  } else if (fourATScore >= 1) {
    alerts.push('Possible cognitive impairment identified via 4AT.');
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  // Check Suicide/Self-Harm
  if (session.fullMse.thoughtContent.suicidalIdeation === 'active') {
    alerts.push('CRITICAL: Active suicide intent identified.');
    riskLevel = 'high';
  } else if (session.fullMse.thoughtContent.suicidalIdeation === 'passive') {
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  if (session.fullMse.thoughtContent.homicidalIdeation) {
    alerts.push('CRITICAL: Violent / Homicidal ideation present.');
    riskLevel = 'high';
  }

  if (session.fullMse.perception.commandHallucinations) {
    alerts.push('CRITICAL: Command hallucinations identified.');
    riskLevel = 'high';
  } else if (session.fullMse.perception.hallucinations) {
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  // Self Neglect / Victimisation
  if (session.risk.toSelf.selfNeglect || session.risk.fromOthers.abuse || session.risk.fromOthers.exploitation) {
    alerts.push('SAFEGUARDING: Concern for self-neglect, abuse, or exploitation.');
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  // Appearance / Behaviour flags
  if (session.absm.behaviour === 'aggressive' || session.absm.behaviour === 'agitated') {
    if (riskLevel === 'low') riskLevel = 'moderate';
  }

  return {
    riskLevel,
    fourATScore,
    isDeliriumPossible,
    alerts,
  };
}

/**
 * Mental Health Risk Calculation logic
 * Stratifies risk into 🔴 HIGH, 🟠 MODERATE, 🟢 LOW
 */

/**
 * Format Mental Health Assessment to ATMISTER string
 */
export function formatMHToATMISTER(session: MentalHealthSession, demographics: PatientDemographics): string {
  const result = calculateMHRisk(session);
  
  return `
M: MENTAL HEALTH PRESENTATION
I: MSE Findings: Appearance ${session.absm.appearance ?? 'well'}, behaviour ${session.absm.behaviour ?? 'calm'}. 
Risk: ${result.riskLevel.toUpperCase()}. ${result.alerts.length > 0 ? result.alerts[0] : 'No acute safety risk identified.'}
S: Vitals: ${session.physicalHealth.headInjury ? 'HEAD INJURY RISK, ' : ''}4AT score ${result.fourATScore}. ${result.isDeliriumPossible ? 'DELIRIUM SUSPECTED.' : ''}
T: Interventions: ${session.notes || 'Routine assessment'}
R: Care Pathway: ${result.riskLevel === 'high' ? 'High clinical risk - urgent MDT assessment requested.' : 'Community follow-up advised.'}
  `.trim();
}

/**
 * Format Mental Health Assessment to SBAR string
 */
export function formatMHToSBAR(session: MentalHealthSession): string {
  const result = calculateMHRisk(session);
  
  return `
S: Patient presents in mental distress. 4AT score is ${result.fourATScore}. Risk level: ${result.riskLevel.toUpperCase()}.
B: ${session.notes || 'No significant history documented.'}
A: MSE Findings: ${session.absm.appearance || 'well'}, ${session.absm.behaviour || 'calm'}. 
${result.alerts.join(' ')}
R: Recommend ${result.riskLevel === 'high' ? 'urgent referral to mental health crisis team / ED' : 'routine safety planning and community referral'}.
  `.trim();
}

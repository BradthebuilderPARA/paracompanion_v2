import { FallsAssessment, FallsDecision, ClinicalFrailtyScale } from './types';

export function calculateFallsRisk(assessment: FallsAssessment): FallsDecision {
  const reds: string[] = [];

  // Time-critical / Red Flags
  if (assessment.hasHeadInjury && assessment.onAnticoagulants) {
    reds.push('Head injury + Anticoagulants');
  }
  if (assessment.hasLossOfConsciousness) {
    reds.push('Suspected TLoC / Syncope');
  }
  if (assessment.hasNeckBackPain) {
    reds.push('Suspected Spinal Injury');
  }
  if (assessment.hasRedFlags) {
    reds.push('Other Red Flag markers');
  }
  if (assessment.mobilityStatus === 'unable') {
    reds.push('Unable to weight-bear / mobility failure');
  }

  // Check for Postural Hypotension (Positive if Systolic drop >= 20, or <90, or Diastolic drop >= 10 with symptoms)
  if (assessment.posturalHypotension) {
    const { lyingBP, standing1MinBP, standing3MinBP } = assessment.posturalHypotension;
    const checks = [standing1MinBP, standing3MinBP].filter(Boolean);
    
    for (const standing of checks) {
      if (standing) {
        const sysDrop = lyingBP.systolic - standing.systolic;
        const diaDrop = lyingBP.diastolic - standing.diastolic;
        
        if (sysDrop >= 20 || standing.systolic < 90 || (diaDrop >= 10 && assessment.posturalHypotension.symptomsPresent)) {
          reds.push('Positive Postural Hypotension drop');
          break;
        }
      }
    }
  }

  if (assessment.frailtyScale >= 7) {
    reds.push(`Severe Frailty (CFS ${assessment.frailtyScale}) - Clinical complexity`);
  }

  if (reds.length > 0) {
    return {
      conveyance: 'hospital',
      reason: reds.join(', '),
      isTimeCritical: assessment.hasHeadInjury || assessment.hasLossOfConsciousness || assessment.hasNeckBackPain,
      referralRecommended: true,
    };
  }

  // Community management criteria: No red flags, stable vitals, supportive environment
  // In a real app, we'd check NEWS2 here as well.
  
  return {
    conveyance: 'community',
    reason: 'Stable assessment; community referral indicated.',
    isTimeCritical: false,
    referralRecommended: true,
  };
}

export const CFS_DESCRIPTIONS: Record<number, string> = {
  1: 'Very Fit – robust, active, energetic',
  2: 'Well – no active disease symptoms',
  3: 'Managing Well – medical problems controlled',
  4: 'Vulnerable – not dependent, symptoms limit activities',
  5: 'Mildly Frail – evident slowing, help with high-order IADLs',
  6: 'Moderately Frail – needs help with all outside activities',
  7: 'Severely Frail – completely dependent for personal care',
  8: 'Very Severely Frail – completely dependent, approaching end of life',
  9: 'Terminally Ill – life expectancy <6 months',
};

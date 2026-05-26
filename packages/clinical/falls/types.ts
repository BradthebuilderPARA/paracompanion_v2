export enum ClinicalFrailtyScale {
  VERY_FIT = 1,
  WELL = 2,
  MANAGING_WELL = 3,
  VULNERABLE = 4,
  MILDLY_FRAIL = 5,
  MODERATELY_FRAIL = 6,
  SEVERELY_FRAIL = 7,
  VERY_SEVERELY_FRAIL = 8,
  TERMINALLY_ILL = 9,
}

export interface FallsSPLAT {
  symptoms: string[]; // Dizziness, chest pain, palpitations, syncope, fatigue
  previousFalls: number;
  fearOfFalling: boolean;
  location: string;
  activity: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface FallsRiskFactors {
  extrinsic: string[]; // footwear, walking aids, floor surfaces, lighting, pets, clutter, telecare
  intrinsic: string[]; // comorbidities, medications, cognitive impairment, frailty, sensory deficits, weakness
}

export interface PosturalHypotensionCheck {
  lyingBP: { systolic: number; diastolic: number };
  standing1MinBP?: { systolic: number; diastolic: number };
  standing3MinBP?: { systolic: number; diastolic: number };
  symptomsPresent: boolean;
}

export interface FallsAssessment {
  timestamp: string;
  splat: FallsSPLAT;
  riskFactors: FallsRiskFactors;
  frailtyScale: ClinicalFrailtyScale;
  posturalHypotension?: PosturalHypotensionCheck;
  isWitnessed: boolean;
  longLieDuration?: number; // minutes
  hasHeadInjury: boolean;
  onAnticoagulants: boolean;
  hasLossOfConsciousness: boolean;
  hasNeckBackPain: boolean;
  hasRedFlags: boolean;
  mobilityStatus: 'full' | 'reduced' | 'unable';
}

export interface FallsDecision {
  conveyance: 'hospital' | 'community';
  reason: string;
  isTimeCritical: boolean;
  referralRecommended: boolean;
}

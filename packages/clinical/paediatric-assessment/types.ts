export type PaediatricAgeBand = '<1 year' | '1-2 yrs' | '2-5 yrs' | '5-12 yrs' | 'Over 12 yrs';

export type TrafficLightRisk = 'green' | 'amber' | 'red';

export interface PaediatricAssessmentParams {
  ageInMonths: number;
  respirationRate?: number;
  heartRate?: number;
  spO2?: number;
  temperature?: number;
  capillaryRefillTime?: number;
  
  // Respiratory Signs
  grunting?: boolean;
  chestIndrawing?: 'none' | 'moderate' | 'severe';
  nasalFlaring?: boolean;
  crackles?: boolean;

  // Circulation & Skin
  skinColour?: 'normal' | 'pallor_reported' | 'pale_mottled_cyanotic';
  hydration?: 'normal' | 'dry_mucous' | 'poor_feeding' | 'reduced_urine' | 'reduced_turgor';
  
  // Activity / AVPU
  activity?: 'normal' | 'not_responding_socially' | 'wakes_only_prolonged' | 'decreased_activity' | 'ill_appearing' | 'does_not_wake' | 'weak_high_pitched_cry';

  // Other Red Flags
  nonBlanchingRash?: boolean;
  bulgingFontanelle?: boolean;
  neckStiffness?: boolean;
  statusEpilepticus?: boolean;
  focalNeurological?: boolean;
  feverFor5Days?: boolean;
  rigors?: boolean;
  swellingLimbJoint?: boolean;
  nonWeightBearing?: boolean;
}

export interface PaediatricAssessmentResult {
  ageBand: PaediatricAgeBand;
  trafficLight: TrafficLightRisk;
  redFlagsTriggered: string[];
  amberFlagsTriggered: string[];
  isNormalHR: boolean;
  isNormalRR: boolean;
  expectedHRRange: string;
  expectedRRRange: string;
}

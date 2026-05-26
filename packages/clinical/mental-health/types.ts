/**
 * Mental Health Assessment Types
 * Based on ABSM (Appearance, Behaviour, Speech, Mood) and 4AT Screening
 */

export interface ABSMState {
  appearance: 'well' | 'dishevelled' | 'neglected' | null;
  behaviour: 'calm' | 'agitated' | 'aggressive' | 'withdrawn' | null;
  eyeContact: 'normal' | 'avoidant' | 'intense' | null;
  psychomotor: 'normal' | 'slowed' | 'restless' | null;
  speechRate: 'slow' | 'normal' | 'rapid' | null;
  speechVolume: 'quiet' | 'normal' | 'loud' | null;
  speechCoherence: 'coherent' | 'disorganised' | null;
  speechPressure: boolean;
  mood: 'low' | 'normal' | 'elevated' | null;
  affect: 'flat' | 'blunted' | 'labile' | 'congruent' | null;
  orientation: {
    time: boolean;
    place: boolean;
    person: boolean;
  };
  attention: 'intact' | 'impaired' | null;
  memory: 'intact' | 'impaired' | null;
  deliriumSuspected: boolean;
}

export interface FullMSEState {
  thoughtProcess: 'linear' | 'tangential' | 'circumstantial' | 'disorganised' | null;
  thoughtContent: {
    delusions: boolean;
    delusionType?: 'paranoid' | 'grandiose' | 'other';
    obsessions: boolean;
    suicidalIdeation: 'none' | 'passive' | 'active';
    homicidalIdeation: boolean;
  };
  perception: {
    hallucinations: boolean;
    hallucinationType?: Array<'auditory' | 'visual' | 'tactile' | 'olfactory' | 'gustatory'>;
    commandHallucinations: boolean;
  };
  insight: 'good' | 'partial' | 'none' | null;
  judgement: 'intact' | 'impaired' | null;
}

export interface FourATState {
  alertness: 0 | 4 | null; // 0: Normal/Mild sleepiness, 4: Clearly abnormal
  amt4: {
    age: boolean;
    dob: boolean;
    place: boolean;
    year: boolean;
  };
  attention: 0 | 1 | 2 | null; // 0: 7+ months, 1: <7 months, 2: Untestable
  acuteChange: 0 | 4 | null; // 0: No, 4: Yes
}

export interface MentalHealthRisk {
  toSelf: {
    suicide: boolean;
    selfHarm: boolean;
    selfNeglect: boolean;
    substanceUse: boolean;
    accidentalInjury: boolean;
  };
  toOthers: {
    aggression: boolean;
    violence: boolean;
    neglectOfDependants: boolean;
  };
  fromOthers: {
    abuse: boolean;
    exploitation: boolean;
    radicalisation: boolean;
    victimisation: boolean;
  };
  protectiveFactors: string[];
}

export interface MentalCapacityAssessment {
  understands: boolean;
  retains: boolean;
  weighs: boolean;
  communicates: boolean;
  hasCapacity: boolean | 'uncertain';
}

export interface MentalHealthSession {
  absm: ABSMState;
  fullMse: FullMSEState;
  fourAT: FourATState;
  risk: MentalHealthRisk;
  capacity: MentalCapacityAssessment;
  physicalHealth: {
    vitalsLinked: boolean;
    headInjury: boolean;
    intoxication: boolean;
  };
  notes: string;
}

export type MHRiskLevel = 'low' | 'moderate' | 'high';

export interface MHResult {
  riskLevel: MHRiskLevel;
  fourATScore: number;
  isDeliriumPossible: boolean;
  alerts: string[];
}

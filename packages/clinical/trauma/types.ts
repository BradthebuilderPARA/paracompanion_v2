import { PatientDemographics } from '../index';

export enum TraumaMechanism {
  BLUNT = 'Blunt',
  PENETRATING = 'Penetrating',
  FALL = 'Fall',
  RTC = 'RTC',
  HANGING = 'Hanging',
  CRUSH = 'Crush / Entrapment',
}

export interface SceneAssessment {
  safety: boolean;
  ppeApplied: boolean;
  mechanism: TraumaMechanism;
  environment: {
    access: boolean;
    weather: string;
    light: string;
  };
  numberOfPatients: number;
  extraResources: {
    senior: boolean;
    airAmbulance: boolean;
    multiCrew: boolean;
  };
  locationName: string; // Manual input as per user feedback (No GPS)
}

export interface PrimarySurvey {
  catastrophicHaemorrhage: {
    present: boolean;
    interventions: ('pressure' | 'tourniquet' | 'packing')[];
  };
  airway: {
    status: 'clear' | 'obstructed' | 'maintained';
    obstructionType?: string;
    adjuncts: ('op' | 'np' | 'igels' | 'ett')[];
  };
  breathing: {
    rate: number; // 1-5 (qualitative scale as per KB)
    effort: 'normal' | 'increased' | 'decreased';
    oxygenLpm?: number;
    twelveMnemonic: boolean;
  };
  circulation: {
    pulse: 'strong' | 'weak' | 'absent';
    capRefill: number; // seconds
    perfusion: 'normal' | 'pale' | 'mottled';
    ivAccess: boolean;
    txaGiven: boolean;
  };
  disability: {
    gcs: {
      eye: number;
      verbal: number;
      motor: number;
      total: number;
    };
    pupils: 'equal' | 'unequal' | 'pinpoint' | 'blown';
    bloodGlucose: number;
  };
  exposure: {
    wounds: string[];
    isTrapped: boolean;
  };
}

export interface SecondarySurvey {
  head: string;
  neck: string;
  chest: string;
  abdomen: string;
  pelvis: string;
  limbs: string;
  frailtyScore?: number; // >65 only
}

export interface TraumaSessionState {
  id: string;
  startTime: string;
  demographics: PatientDemographics;
  scene: SceneAssessment;
  primarySurvey: PrimarySurvey;
  secondarySurvey?: SecondarySurvey;
  entrapment: {
    isEntrapped: boolean;
    level: 'self-assisted' | 'fully-entrapped' | 'none';
    extricationPlan?: string;
  };
  immobilisation: {
    scoop: boolean;
    longboard: boolean;
    collar: boolean;
  };
}

export interface ATMISTER {
  ageSex: string;
  timeOfIncident: string;
  mechanism: string;
  injuries: string;
  signs: string;
  treatment: string;
  eta: string;
  requirements: string;
}

export interface METHANE {
  majorIncident: boolean;
  exactLocation: string;
  typeOfIncident: string;
  hazards: string[];
  access: string;
  numberSeverity: string;
  emergencyServices: string[];
}

export interface Top10TraumaPrompt {
  id: number;
  type: string;
  considerations: string[];
  triggers: string[];
}

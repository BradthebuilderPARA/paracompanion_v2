export enum PatientType {
  ADULT = 'Adult',
  PAEDIATRIC = 'Paediatric'
}

export enum PaediatricType {
  INFANT = 'Infant (<1yr)',
  CHILD = 'Child (1-18yrs)'
}

export enum ReversibleCause {
  HYPOXIA = 'Hypoxia',
  HYPOVOLAEMIA = 'Hypovolaemia',
  HYPO_HYPERKALAEMIA = 'Hypo/Hyperkalaemia',
  HYPO_HYPERTHERMIA = 'Hypo/Hyperthermia',
  TENSION_PNEUMOTHORAX = 'Tension Pneumothorax',
  CARDIAC_TAMPO_NADE = 'Cardiac Tamponade',
  TOXINS = 'Toxins',
  THROMBOSIS_CORONARY = 'Thrombosis (Coronary)',
  THROMBOSIS_PULMONARY = 'Thrombosis (Pulmonary)',
  HYPOGLYCAEMIA = 'Hypoglycaemia'
}

export enum CardiacRhythm {
  VF = 'VF',
  PVT = 'pVT',
  PEA = 'PEA',
  ASYSTOLE = 'Asystole',
  ROSC = 'ROSC'
}

export enum InterventionType {
  SHOCK = 'Shock',
  ADRENALINE = 'Adrenaline',
  AMIODARONE = 'Amiodarone',
  FLUID_BOLUS = 'Fluid Bolus',
  AIRWAY_IGEL = 'iGEL',
  AIRWAY_ETT = 'ET Tube',
  ACCESS_IV = 'IV Access',
  ACCESS_IO = 'IO Access'
}

export interface ArrestIntervention {
  type: InterventionType;
  value?: string | number;
  timestamp: string;
}

export interface ArrestCauseStatus {
  cause: ReversibleCause;
  ruledOut: boolean;
  notes?: string;
  timestamp?: string;
}

export interface ROSCBundle {
  ecg12Lead: boolean;
  spo2Targeted: boolean;
  etco2Optimized: boolean;
  bpMeasured: boolean;
  fluidsAdministered: boolean;
  glucoseChecked: boolean;
}

export interface ArrestSessionState {
  id: string;
  startTime: string;
  lastHeartbeat: string;
  toolId: string; // v1.3: Reference to clinical_tools table
  toolType: string; // Legacy: ARREST
  toolVersionAtTime: string; // Snapshotted at creation
  observationsSchemaVersion: string;
  scoresSchemaVersion: string;
  sessionSource: 'manual' | 'arrival_mode' | 'crew_shared';
  currentRhythm?: CardiacRhythm;
  patientType: PatientType;
  paediatricType?: PaediatricType;
  ageYears?: number;
  rhythmHistory: { rhythm: CardiacRhythm; timestamp: string }[];
  interventions: ArrestIntervention[];
  causes: ArrestCauseStatus[];
  isRecovered: boolean;
  roscAchieved: boolean;
  roscBundle?: ROSCBundle;
  terminationConsidered?: boolean;
}

export const INITIAL_ARREST_CAUSES: ArrestCauseStatus[] = Object.values(ReversibleCause).map(cause => ({
  cause,
  ruledOut: false
}));

export const INITIAL_ROSC_BUNDLE: ROSCBundle = {
  ecg12Lead: false,
  spo2Targeted: false,
  etco2Optimized: false,
  bpMeasured: false,
  fluidsAdministered: false,
  glucoseChecked: false
};

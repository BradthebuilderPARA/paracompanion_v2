export type TimeBand = 'thrombolysis' | 'thrombectomy' | 'extended' | 'unknown' | 'wakeup';

export type LKWCertainty = 'certain' | 'estimated' | 'unreliable';

export interface StrokeParams {
  lkwTimestamp: string | null; // ISO string
  lkwCertainty: LKWCertainty;
  isWakeUp: boolean;
  symptoms: {
    facialDroop: boolean;
    armWeakness: boolean;
    legWeakness: boolean;
    speechDifficulties: boolean;
    balanceIssues: boolean;
    eyeDeviations: boolean;
    visualDisturbances: boolean;
  };
  antithrombotic: {
    status: 'yes' | 'no' | 'unknown';
    drugName?: string;
    lastDoseTime?: string; // ISO string
  };
  redFlags: {
    gcsLow: boolean; // <= 7
    seizureAtOnset: boolean;
    hypoglycaemia: boolean;
    recentTrauma: boolean;
    terminalIllness: boolean;
    symptomsResolved: boolean;
  };
}

export interface StrokeResult {
  timeBand: TimeBand;
  badgeColor: string; // Hex code or named color
  elapsedTime: string; // e.g., "14h 22m ago"
  isHighAlert: boolean; // Due to antithrombotics
  criticalAlert: boolean; // Due to red flags
  narrative: string; // ATMIST-style readout
}

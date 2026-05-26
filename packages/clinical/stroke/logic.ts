import { StrokeParams, StrokeResult, TimeBand } from './types';
import { NEWS2Params } from '../index';

const STROKE_COLORS = {
  thrombolysis: '#059669', // Green
  thrombectomy: '#F59E0B', // Amber
  extended: '#6B7280',     // Grey
  unknown: '#6B7280',      // Grey
  wakeup: '#8B5CF6',      // Purple
};

export function calculateTimeBand(lkwTimestamp: string | null, isWakeUp: boolean): StrokeResult {
  if (isWakeUp) {
    return {
      timeBand: 'wakeup',
      badgeColor: STROKE_COLORS.wakeup,
      elapsedTime: 'Wake-Up Stroke',
      isHighAlert: false,
      criticalAlert: false,
      narrative: '',
    };
  }

  if (!lkwTimestamp) {
    return {
      timeBand: 'unknown',
      badgeColor: STROKE_COLORS.unknown,
      elapsedTime: 'Unknown LKW',
      isHighAlert: false,
      criticalAlert: false,
      narrative: '',
    };
  }

  const lkwDate = new Date(lkwTimestamp);
  const now = new Date();
  const diffMs = now.getTime() - lkwDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const totalHours = Math.floor(diffHours);

  let timeBand: TimeBand = 'unknown';
  if (diffHours < 4.5) {
    timeBand = 'thrombolysis';
  } else if (diffHours < 24) {
    timeBand = 'thrombectomy';
  } else if (diffHours < 48) {
    timeBand = 'extended';
  }

  return {
    timeBand,
    badgeColor: STROKE_COLORS[timeBand],
    elapsedTime: `${totalHours}h ${diffMinutes}m ago`,
    isHighAlert: false,
    criticalAlert: false,
    narrative: '',
  };
}

export function generateATMISTNarrative(
  params: StrokeParams, 
  vitals?: NEWS2Params,
  demographics?: { age: number; sex: string }
): string {
  const parts: string[] = [];

  // Age/Sex
  if (demographics) {
    parts.push(`PATIENT: ${demographics.age}yo ${demographics.sex}.`);
  }

  // LKW / Window
  const { elapsedTime, timeBand } = calculateTimeBand(params.lkwTimestamp, params.isWakeUp);
  parts.push(`LKW: ${elapsedTime}. WINDOW: ${timeBand.toUpperCase()}.`);

  // Symptoms
  const symptoms = Object.entries(params.symptoms)
    .filter(([_, val]) => val)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').toUpperCase());
  
  if (symptoms.length > 0) {
    parts.push(`SYMPTOMS: ${symptoms.join(', ')}.`);
  }

  // Anticoagulation
  if (params.antithrombotic.status === 'yes') {
    parts.push(`HIGH ALERT: Patient on ${params.antithrombotic.drugName || 'Anticoagulant'}.`);
  }

  // Vitals
  if (vitals) {
    parts.push(`VITALS: BP ${vitals.systolicBP}/${vitals.diastolicBP || '--'}, GCS ${vitals.gcs?.total || vitals.consciousness}, BM ${vitals.bloodGlucose || '--'}.`);
  }

  return parts.join(' ');
}

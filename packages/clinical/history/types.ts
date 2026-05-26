import { PatientDemographics } from '../index';

export interface RedFlagItem {
  id: string;
  label: string;
  status: 'positive' | 'negative' | null;
}

export interface HistoryQuestion {
  id: string;
  question: string;
  chips?: string[];
  answer?: string;
}

export interface HistoryPresentation {
  key: string;
  label: string;
  keywords: string[];
  redFlags: RedFlagItem[];
  questions: HistoryQuestion[];
}

export interface HistorySessionState {
  presentationKey: string | null;
  redFlags: RedFlagItem[];
  questions: HistoryQuestion[];
  isSafetyConfirmed: boolean;
  timestamp: string;
}

export interface HistoryResult {
  narrative: string;
  hasCriticalFlags: boolean;
  positiveFlags: string[];
}

import { 
  checkHotResume, 
  toggleCauseRuleOut, 
  getNextAdrenalineWindow,
  isALSTimerActive,
  getDrugGuidance,
  getROSCBundleCompletion,
  getPaediatricVentilationRate,
  getPaediatricGuideline
} from './logic';
import { 
  ReversibleCause, 
  INITIAL_ARREST_CAUSES, 
  CardiacRhythm, 
  InterventionType, 
  ArrestSessionState,
  INITIAL_ROSC_BUNDLE,
  ArrestIntervention,
  PatientType,
  PaediatricType
} from './types';
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

const MOCK_STATE: ArrestSessionState = {
  id: 'test-session',
  startTime: new Date().toISOString(),
  lastHeartbeat: new Date().toISOString(),
  toolId: 'arrest',
  toolType: 'ARREST',
  toolVersionAtTime: '1.0.0',
  observationsSchemaVersion: '1.0',
  scoresSchemaVersion: '1.0',
  sessionSource: 'manual',
  currentRhythm: CardiacRhythm.PEA,
  patientType: PatientType.ADULT,
  rhythmHistory: [],
  interventions: [] as ArrestIntervention[],
  causes: INITIAL_ARREST_CAUSES,
  isRecovered: false,
  roscAchieved: false
};

describe('Cardiac Arrest Logic', () => {
  describe('checkHotResume', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('returns true for session within 120-minute window', () => {
      const now = new Date('2026-03-26T15:00:00.000Z');
      jest.setSystemTime(now);
      const last = new Date(now.getTime() - 119 * 60 * 1000).toISOString();
      expect(checkHotResume(last)).toBe(true);
    });
  });

  describe('isALSTimerActive', () => {
    test('returns true only when both Airway and Access are established', () => {
      const state1: ArrestSessionState = { ...MOCK_STATE, interventions: [] };
      expect(isALSTimerActive(state1)).toBe(false);

      const state2: ArrestSessionState = { 
        ...MOCK_STATE, 
        interventions: [{ type: InterventionType.AIRWAY_IGEL, timestamp: 'now' }] 
      };
      expect(isALSTimerActive(state2)).toBe(false);

      const state3: ArrestSessionState = { 
        ...MOCK_STATE, 
        interventions: [
          { type: InterventionType.AIRWAY_IGEL, timestamp: 'now' },
          { type: InterventionType.ACCESS_IV, timestamp: 'now' }
        ] 
      };
      expect(isALSTimerActive(state3)).toBe(true);
    });
  });

  describe('getDrugGuidance', () => {
    test('recommends immediate Adrenaline for non-shockable rhythms', () => {
      const state: ArrestSessionState = { ...MOCK_STATE, currentRhythm: CardiacRhythm.ASYSTOLE, interventions: [] };
      expect(getDrugGuidance(state)).toBe('Adrenaline 1mg immediately');
    });

    test('recommends Adrenaline/Amiodarone at correct shock milestones (Shockable)', () => {
      const interventions: ArrestIntervention[] = [
        { type: InterventionType.SHOCK, timestamp: 'now' },
        { type: InterventionType.SHOCK, timestamp: 'now' },
        { type: InterventionType.SHOCK, timestamp: 'now' },
      ];
      const state: ArrestSessionState = { ...MOCK_STATE, currentRhythm: CardiacRhythm.VF, interventions };
      
      expect(getDrugGuidance(state)).toBe('Amiodarone 300mg now (Post-shock 3)');
      
      // Record Amiodarone 300mg
      const updatedInterventions = [...interventions, { type: InterventionType.AMIODARONE, value: 300, timestamp: 'now' }];
      const stateAg: ArrestSessionState = { ...state, interventions: updatedInterventions };
      expect(getDrugGuidance(stateAg)).toBe('Adrenaline 1mg now (Post-shock 3)');
    });

    test('returns formula-based reminders for Paediatric patients', () => {
      const state: ArrestSessionState = { 
        ...MOCK_STATE, 
        patientType: PatientType.PAEDIATRIC, 
        currentRhythm: CardiacRhythm.VF,
        interventions: [
          { type: InterventionType.SHOCK, timestamp: 'now' },
          { type: InterventionType.SHOCK, timestamp: 'now' },
          { type: InterventionType.SHOCK, timestamp: 'now' }
        ]
      };
      
      expect(getDrugGuidance(state)).toBe('AMIODARONE: 5 mg/kg (Max 300mg)');
    });
  });

  describe('getPaediatricVentilationRate', () => {
    test('maps age to correct ventilation frequency', () => {
      expect(getPaediatricVentilationRate(0.5)).toBe(25);  // Infant
      expect(getPaediatricVentilationRate(5)).toBe(20);    // Child
      expect(getPaediatricVentilationRate(10)).toBe(15);   // Teen
      expect(getPaediatricVentilationRate(15)).toBe(10);   // Adult-like
      expect(getPaediatricVentilationRate(undefined)).toBe(10);
    });
  });

  describe('getPaediatricGuideline', () => {
    test('returns correct formula strings', () => {
      expect(getPaediatricGuideline(InterventionType.SHOCK)).toBe('4 J/kg (Max 360J)');
      expect(getPaediatricGuideline(InterventionType.ADRENALINE)).toBe('10 mcg/kg (Max 1mg)');
    });
  });

  describe('getROSCBundleCompletion', () => {
    test('calculates correct percentage of completed tasks', () => {
      const bundle = { ...INITIAL_ROSC_BUNDLE, ecg12Lead: true, glucoseChecked: true };
      // 2 out of 6
      expect(getROSCBundleCompletion(bundle)).toBe(33);
    });
  });
});

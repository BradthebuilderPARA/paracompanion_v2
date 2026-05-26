import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ClinicalSession, 
  PatientDemographics, 
  NEWS2Params,
  PaediatricAssessmentParams,
  MOEWSParams,
  NEWS2Result,
  PaediatricAssessmentResult,
  MOEWSResult,
  ArrestSessionState,
  TraumaSessionState
} from '@paracompanion/clinical';

export type ClinicalModule = 'NEWS2' | 'PAEDS' | 'MOEWS' | 'ARREST' | 'TRAUMA' | null;

interface ClinicalState {
  activeSession: ClinicalSession<NEWS2Params | PaediatricAssessmentParams | MOEWSParams, NEWS2Result | PaediatricAssessmentResult | MOEWSResult> | null;
  arrestSession: ArrestSessionState | null;
  traumaSession: TraumaSessionState | null;
  activeModule: ClinicalModule;
  
  startSession: (demographics: PatientDemographics & { type: ClinicalModule }) => void;
  setActiveModule: (module: ClinicalModule) => void;
  addObservation: (vitals: any, result: any) => void;
  endSession: () => void;
}

export const useClinicalSessionStore = create<ClinicalState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      arrestSession: null,
      traumaSession: null,
      activeModule: null,

      startSession: (demographics) => {
        set({
          activeSession: {
            id: crypto.randomUUID(),
            startTime: new Date().toISOString(),
            lastHeartbeat: new Date().toISOString(),
            toolId: 'web',
            toolType: demographics.type || 'NEWS2',
            toolVersionAtTime: '1.0',
            observationsSchemaVersion: '1.0',
            scoresSchemaVersion: '1.0',
            sessionSource: 'manual',
            demographics,
            observations: [],
          },
          activeModule: demographics.type
        });
      },

      setActiveModule: (module) => set({ activeModule: module }),

      addObservation: (vitals, result) => {
        set((state) => {
          if (!state.activeSession) return state;
          
          return {
            activeSession: {
              ...state.activeSession,
              observations: [
                ...state.activeSession.observations,
                {
                  timestamp: new Date().toISOString(),
                  vitals,
                  result
                }
              ]
            }
          };
        });
      },

      endSession: () => {
        set({
          activeSession: null,
          arrestSession: null,
          traumaSession: null,
          activeModule: null
        });
      }
    }),
    {
      name: 'paracompanion-web-clinical-storage',
    }
  )
);

import { 
  ArrestSessionState, 
  CardiacRhythm, 
  InterventionType, 
  ArrestIntervention,
  ROSCBundle,
  ArrestCauseStatus,
  ReversibleCause,
  PatientType,
  PaediatricType
} from './types';

/**
 * Checks if a session is eligible for 'Hot Resume' (within 120 minutes)
 */
export function checkHotResume(lastHeartbeat: string | null): boolean {
  if (!lastHeartbeat) return false;
  const last = new Date(lastHeartbeat).getTime();
  const now = new Date().getTime();
  const diffMinutes = (now - last) / (1000 * 60);
  return diffMinutes <= 120;
}

/**
 * Toggles a reversible cause and sets a timestamp
 */
export function toggleCauseRuleOut(causes: ArrestCauseStatus[], cause: ReversibleCause): ArrestCauseStatus[] {
  return causes.map(c => {
    if (c.cause === cause) {
      const isNowRuledOut = !c.ruledOut;
      return {
        ...c,
        ruledOut: isNowRuledOut,
        timestamp: isNowRuledOut ? new Date().toISOString() : undefined
      };
    }
    return c;
  });
}

/**
 * Checks if the ALS 30-minute timer should be active.
 * Clinical Trigger: Airway + IV/IO Access established.
 */
export function isALSTimerActive(state: ArrestSessionState): boolean {
  const hasAirway = state.interventions.some(i => 
    i.type === InterventionType.AIRWAY_IGEL || i.type === InterventionType.AIRWAY_ETT
  );
  const hasAccess = state.interventions.some(i => 
    i.type === InterventionType.ACCESS_IV || i.type === InterventionType.ACCESS_IO
  );
  return hasAirway && hasAccess;
}

/**
 * Returns dynamic drug guidance based on RCUK 2025 ALS guidelines.
 */
export function getDrugGuidance(state: ArrestSessionState): string | null {
  const shocks = state.interventions.filter(i => i.type === InterventionType.SHOCK).length;
  const adrenaline = state.interventions.filter(i => i.type === InterventionType.ADRENALINE).length;
  const amiodarone = state.interventions.filter(i => i.type === InterventionType.AMIODARONE).length;

  // Paediatric Pathway (PALS 2025)
  if (state.patientType === PatientType.PAEDIATRIC) {
    const isShockable = state.currentRhythm === CardiacRhythm.VF || state.currentRhythm === CardiacRhythm.PVT;
    
    // Amiodarone milestones
    if (isShockable && shocks >= 3 && amiodarone === 0) return 'AMIODARONE: 5 mg/kg (Max 300mg)';
    if (isShockable && shocks >= 5 && amiodarone === 1) return 'AMIODARONE: 5 mg/kg (Max 150mg)';

    // Adrenaline milestones
    if (isShockable && shocks >= 3 && adrenaline === 0) return 'ADRENALINE: 10 mcg/kg (Max 1mg)';
    if (!isShockable && adrenaline === 0) return 'ADRENALINE: 10 mcg/kg IMMEDIATELY';

    // Shock Energy Reminders
    if (isShockable) {
       if (shocks === 0) return 'SHOCK: 4 J/kg (INITIAL)';
       if (shocks >= 5) return 'SHOCK: 8 J/kg (ESCALATION)';
       return 'SHOCK: 4 J/kg';
    }
    return null;
  }

  // Adult Pathway (RCUK 2025)
  // Amiodarone logic (Post-shock 3 and 5)
  if (shocks >= 3 && amiodarone === 0) return 'Amiodarone 300mg now (Post-shock 3)';
  if (shocks >= 5 && amiodarone === 1) return 'Amiodarone 150mg now (Post-shock 5)';

  // Adrenaline logic for Shockable vs Non-Shockable
  const isShockable = state.currentRhythm === CardiacRhythm.VF || state.currentRhythm === CardiacRhythm.PVT;
  if (isShockable && shocks >= 3 && adrenaline === 0) return 'Adrenaline 1mg now (Post-shock 3)';
  if (!isShockable && adrenaline === 0) return 'Adrenaline 1mg immediately';

  return null;
}

/**
 * Returns ventilation rate based on age (PALS 2025 guidelines)
 */
export function getPaediatricVentilationRate(ageYears?: number): number {
  if (ageYears === undefined) return 10; // Default to adult if unknown
  if (ageYears < 1) return 25;
  if (ageYears <= 8) return 20;
  if (ageYears <= 12) return 15;
  return 10;
}

/**
 * Returns the guideline formula for a specific intervention.
 */
export function getPaediatricGuideline(type: InterventionType): string | null {
  switch (type) {
    case InterventionType.SHOCK: return '4 J/kg (Max 360J)';
    case InterventionType.ADRENALINE: return '10 mcg/kg (Max 1mg)';
    case InterventionType.AMIODARONE: return '5 mg/kg (Max 300mg/150mg)';
    case InterventionType.FLUID_BOLUS: return '10 ml/kg';
    default: return null;
  }
}

/**
 * Calculates correct 3-5 minute window for next Adrenaline dose.
 */
export function getNextAdrenalineWindow(lastDoseTimestamp: string | null): { min: string; max: string } | null {
  if (!lastDoseTimestamp) return null;
  const last = new Date(lastDoseTimestamp);
  
  const min = new Date(last.getTime() + 3 * 60 * 1000).toISOString();
  const max = new Date(last.getTime() + 5 * 60 * 1000).toISOString();
  
  return { min, max };
}

/**
 * Calculates ROSC Bundle Completion percentage.
 */
export function getROSCBundleCompletion(bundle: ROSCBundle | undefined): number {
  if (!bundle) return 0;
  const fields = Object.values(bundle);
  const completed = fields.filter(v => v === true).length;
  return Math.round((completed / fields.length) * 100);
}

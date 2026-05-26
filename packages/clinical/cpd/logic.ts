import { sanitize } from '@paracompanion/airlock';
import type { ClinicalSession } from '../index';

export interface GibbsDraft {
  id: string; // Unique draft ID
  sessionId?: string; // Optional link to a clinical session
  description: string;
  feelings: string;
  evaluation: string;
  analysis: string;
  conclusion: string;
  actionPlan: string;
  isShared: boolean;
  lastSavedAt: string;
}

export interface SanitizedGibbsReflection {
  description: string;
  feelings: string;
  evaluation: string;
  analysis: string;
  conclusion: string;
  actionPlan: string;
  piiRemovedCount: number;
}

/**
 * Extracts the presenting complaint and calculated scores from a clinical session
 * to pre-populate the Description step of the Gibbs Reflection Wizard.
 */
export function generateDescriptionPrompt(session: ClinicalSession): string {
  let description = 'Clinical Case - ' + session.toolType.toUpperCase() + '\n';
  description += 'Date: ' + new Date(session.startTime).toLocaleDateString() + '\n\n';
  
  // Extract Presenting Complaint
  if (session.demographics.presentingProblem && session.demographics.presentingProblem.length > 0) {
    description += '-- Presenting Complaint --\n';
    description += session.demographics.presentingProblem.join(', ') + '\n\n';
  }

  // Extract Final Scores
  const lastObservation = session.observations[session.observations.length - 1];
  if (lastObservation && lastObservation.result) {
    const result = lastObservation.result as any;
    description += '-- Clinical Assessment Summary --\n';
    
    if (result.score !== undefined) {
      description += `Calculated Score: ${result.score}\n`;
    }
    if (result.riskLevel) {
      description += `Risk Level: ${result.riskLevel.toUpperCase()}\n`;
    }
    if (result.isCritical !== undefined) {
      description += `Critical Flags: ${result.isCritical ? 'Yes' : 'No'}\n`;
    }
    if (result.recommendedAction) {
      description += `Action Guideline: ${result.recommendedAction}\n`;
    }
  }

  return description;
}

/**
 * Sanitizes all narrative fields of a reflection via the Airlock Engine.
 * Must be called before saving to the database if the user opts-in to Peer Sharing.
 */
export function sanitizeReflectionForSharing(draft: GibbsDraft): SanitizedGibbsReflection {
  const sanitizeField = (text: string) => {
    if (!text) return { content: '', piiCount: 0 };
    const result = sanitize(text);
    const count = result.metadata.nhsNumbersFound + 
                  result.metadata.phoneNumbersFound + 
                  result.metadata.postcodesFound + 
                  result.metadata.dobsFound + 
                  result.metadata.namesFound;
    return { content: result.content, piiCount: count };
  };

  const desc = sanitizeField(draft.description);
  const feel = sanitizeField(draft.feelings);
  const evalField = sanitizeField(draft.evaluation);
  const mAnal = sanitizeField(draft.analysis);
  const concl = sanitizeField(draft.conclusion);
  const action = sanitizeField(draft.actionPlan);

  const totalPiiRemoved = desc.piiCount + feel.piiCount + evalField.piiCount + 
                          mAnal.piiCount + concl.piiCount + action.piiCount;

  return {
    description: desc.content,
    feelings: feel.content,
    evaluation: evalField.content,
    analysis: mAnal.content,
    conclusion: concl.content,
    actionPlan: action.content,
    piiRemovedCount: totalPiiRemoved,
  };
}

// -----------------------------------------------------------------------------
// STUDENT PLACEMENT LOGIC
// -----------------------------------------------------------------------------

export interface PlacementShift {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  siteName: string;
  signoffStatus?: 'pending' | 'approved' | 'rejected';
}

export interface PlacementProgress {
  totalLoggedHours: number;
  totalValidatedHours: number;
  targetHours: number;
  percentageComplete: number;
}

/**
 * Calculates the total hours from an array of placement shifts.
 * Only shifts that are marked as 'approved' count towards the validated hours.
 */
export function calculatePlacementProgress(
  shifts: PlacementShift[],
  userConfiguredTarget: number = 1500
): PlacementProgress {
  let totalLoggedMs = 0;
  let totalValidatedMs = 0;

  for (const shift of shifts) {
    const start = new Date(shift.startTime).getTime();
    const end = new Date(shift.endTime).getTime();
    
    // Safety check for valid dates
    if (isNaN(start) || isNaN(end) || end < start) {
      continue;
    }

    const durationMs = end - start;
    totalLoggedMs += durationMs;

    if (shift.signoffStatus === 'approved') {
      totalValidatedMs += durationMs;
    }
  }

  // Convert milliseconds to decimal hours
  const msToHours = (ms: number) => Math.round((ms / (1000 * 60 * 60)) * 100) / 100;

  const totalLoggedHours = msToHours(totalLoggedMs);
  const totalValidatedHours = msToHours(totalValidatedMs);

  // Target config
  const targetHours = Math.max(1, userConfiguredTarget);

  let percentageComplete = Math.round((totalValidatedHours / targetHours) * 100);
  if (percentageComplete > 100) percentageComplete = 100;

  return {
    totalLoggedHours,
    totalValidatedHours,
    targetHours,
    percentageComplete,
  };
}

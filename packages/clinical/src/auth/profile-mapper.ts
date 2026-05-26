/**
 * Clinical Profile Mapper
 * Ensures 100% consistency between human-readable roles and backend clinical tiers.
 * Alignment: UK Paramedic Professional Identity.
 */

export type ClinicalRole = 
  | 'student' 
  | 'qualified' 
  | 'specialist' 
  | 'admin';

export type ClinicalTier = 
  | 'learner' 
  | 'practitioner' 
  | 'free';

/**
 * Maps UI Role selection to consistent Backend Tier.
 * Used by both Next.js and Expo apps.
 */
export function mapRoleToTier(role: string): ClinicalTier {
  const normalized = role.toLowerCase();
  
  if (normalized.includes('student')) return 'learner';
  if (normalized.includes('qualified') || normalized.includes('specialist') || normalized.includes('critical')) {
    return 'practitioner';
  }
  if (normalized.includes('admin') || normalized.includes('trust')) {
    return 'practitioner';
  }
  
  return 'free';
}

/**
 * Standard timestamps for DCB0129 Clinical Safety compliance.
 */
export function getCompliancePayload() {
  const now = new Date().toISOString();
  return {
    accepted_terms_at: now,
    accepted_privacy_at: now,
    clinical_safety_onboarding_at: now,
    terms_version: '1.0.0',
    privacy_version: '1.0.0',
    updated_at: now
  };
}

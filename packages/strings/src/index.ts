/**
 * ParaCompanion Shared UI Strings
 * Version: 1.0.0
 * UK Clinical & Brand Voice Aligned
 */

export const STRINGS = {
  BRAND: {
    NAME: 'ParaCompanion',
    TAGLINE: 'Cognitive support for critical care.',
    AUDIENCE: 'Built on shift. For clinicians and pre-hospital practitioners.',
  },
  
  AUTH: {
    SIGN_IN_SENT: 'A sign-in link has been sent to your email address.',
    LOGIN_ASSISTANCE: 'Login Assistance',
    CLINICAL_SUPPORT: 'Contact Clinical Support',
  },
  
  ONBOARDING: {
    TIER_LEARNER: 'Learner',
    TIER_PROFESSIONAL: 'Professional',
    HEADER_LEARNER: 'Access Your Learner Tools',
    HEADER_PROFESSIONAL: 'Access Your Professional Tools',
    EMERGENCY_SERVICES_LABEL: 'Other Emergency (Police/Fire and Rescue)',
    HISTORY_HELPER_LABEL: 'History Helper',
    PLACEMENT_TRACKER_LABEL: 'Placement Tracker & CPD Hub',
    PRICING_SUBTITLE: 'Transparent, sustainable pricing for the duration of your career.',
  },
  
  PATIENT: {
    MODULE_LABEL: 'Patient Module',
    DASHBOARD_HEADER: 'Clinical Dashboard',
    VITALS_NEWS2: 'Vitals & NEWS2',
    NOTES_LABEL: 'Clinical Notes',
    NOTES_PLACEHOLDER: 'Enter clinical notes here. Do NOT include PII like Names or Dates of Birth.',
    CALCULATED_RESULT: 'Calculated Result',
    SAVE_SESSION: 'Save Session',
  },
  
  CLINICAL: {
    SESSION: 'Clinical Session',
    HISTORY_TITLE: 'HISTORY HELPER',
    RED_FLAGS: 'RED FLAG EXCLUSION',
    CONFIRM_FIX: 'CONFIRM: NO RED FLAGS IDENTIFIED',
    SAFETY_VERIFICATION: 'Safety Re-verification',
    SESSION_TIMEOUT: 'Session inactive for >2 hours. Please re-verify.',
    RE_VERIFY: 'RE-VERIFY',
    TREND_LOG: 'Vitals saved to session trend log.',
  },
  
  AIRLOCK: {
    SANITISATION_STATUS: 'Airlock PII Sanitisation Enabled',
    PII_WARNING: 'Session saved! (Warning: PII was detected and redacted by Airlock)',
    SESSION_SAVED: 'Session saved successfully!',
  },
  
  MY_DOCS: {
    DASHBOARD_TITLE: 'My Docs',
    UPLOAD_LABEL: 'Upload Document',
    UPLOAD_DRAG_DROP: 'Drag and drop or click to upload PDF',
    UPLOAD_MAX_SIZE: 'Max file size: 50MB',
    FILE_TYPE_ERROR: 'Invalid file type. Please upload a PDF.',
    SIZE_LIMIT_ERROR: 'File size exceeds 50MB limit.',
    COMPLIANCE_STATUS: 'Compliance Status',
    REVIEW_DATE_LABEL: 'Review Date',
    EXPIRY_DATE_LABEL: 'Expiry Date',
    OFFLINE_READY: 'Available Offline',
    SHARE_DOCUMENT: 'Share Document',
    SHARE_QR_LABEL: 'Generate Sharing QR',
    SHARE_EXPIRY_WARNING: 'QR codes expire after 24 hours.',
    TAGS: {
      SOP: 'SOP',
      GUIDELINE: 'Guideline',
      PERSONAL: 'Personal',
      CERTIFICATE: 'Certificate',
    }
  },

  ACADEMY: {
    HUB_TITLE: 'Para Academy',
    COURSES: 'Courses',
  }
} as const;

export type UIStrings = typeof STRINGS;

/**
 * ParaCompanion Airlock Engine v1.1.0
 * Phase 3: PII Anonymisation & GDPR Compliance
 *
 * FIX v1.1.0: DOB detection now catches all three formats:
 *   - Prefixed:      "DOB: 12/05/1980"
 *   - Pure numeric:  "12-05-80"
 *   - Written month: "12 May 1980"
 *
 * Objectives: Zero dependencies, Offline-safe, High-precision PII detection.
 */

export interface PIIMatch {
  type: 'NHS_NUMBER' | 'PHONE' | 'POSTCODE' | 'DOB' | 'NAME' | 'EMAIL';
  value: string;
  index: number;
  length: number;
}

export interface AirlockResult {
  content: string;
  piiDetected: boolean;
  matches: PIIMatch[];
  metadata: {
    nhsNumbersFound: number;
    phoneNumbersFound: number;
    postcodesFound: number;
    dobsFound: number;
    namesFound: number;
    emailsFound: number;
  };
}

const MONTH_NAMES =
  'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';

/**
 * PII Detection Patterns (UK Specific)
 * NOTE: Patterns are factory functions so we always get a fresh regex with lastIndex=0
 */
const PATTERNS = {
  // NHS Number: 10 digits, formatted as 123 456 7890 or 1234567890
  NHS_NUMBER: () => /\b\d{3}[- ]?\d{3}[- ]?\d{4}\b/g,

  // UK Phone Numbers (Mobile and Landline)
  UK_PHONE: () =>
    /(?:(?:\+44\s?\(0\)\s?\d{2,4})|(?:\+44\s?\d{2,4})|(?:0\d{2,4}))\s?\d{3,4}\s?\d{3,4}/g,

  // UK Postcodes
  UK_POSTCODE: () => /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi,

  // Email Addresses
  EMAIL: () => /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,

  // === DOB: Three-pass strategy ===

  // Pass 1 – Context-prefixed: "DOB: 12/05/1980" or "born 12-05-80"
  // Only the DATE part is captured (group 1) so the prefix stays intact.
  DOB_PREFIXED: () =>
    /(?:dob|d\.o\.b|born|date of birth)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,

  // Pass 2 – Written-month: "12 May 1980", "5 January 2003", "31 Dec 99"
  DOB_WRITTEN: () =>
    new RegExp(
      `\\b\\d{1,2}\\s+(?:${MONTH_NAMES})\\s+\\d{2,4}\\b`,
      'gi'
    ),

  // Pass 3 – Pure numeric (run AFTER prefixed pass to avoid double-replacing)
  // Catches 12/05/1980, 12-05-1980, 12/05/80, 12-05-80
  DOB_NUMERIC: () => /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,

  // Names: "Name: John Smith" | "Patient Jane Doe" | "Mr Andrew Jenkins"
  NAMES_PREFIXED: () =>
    /\b(?:Name|Patient|Pt|Mr|Mrs|Ms|Miss|Dr)\b\.?\s*:?\s+([A-Z][a-z\-]+(?:\s+[A-Z][a-z\-]+)*)/g,
};

/**
 * Scans content for PII and returns an anonymised version with detailed match metadata.
 */
export function sanitize(content: string): AirlockResult {
  const matches: PIIMatch[] = [];

  // Helper: collect all matches for a pattern into the matches array
  const collect = (pattern: RegExp, type: PIIMatch['type']) => {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(content)) !== null) {
      matches.push({ type, value: m[0], index: m.index, length: m[0].length });
    }
  };

  // — Standard PII collection —
  collect(PATTERNS.NHS_NUMBER(), 'NHS_NUMBER');
  collect(PATTERNS.UK_PHONE(), 'PHONE');
  collect(PATTERNS.UK_POSTCODE(), 'POSTCODE');
  collect(PATTERNS.EMAIL(), 'EMAIL');

  // — DOB: three-pass collection —
  // Prefixed pass: capture only the date group
  {
    const re = PATTERNS.DOB_PREFIXED();
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const datePart = m[1];
      if (datePart) {
        const dateIndex = m.index + m[0].indexOf(datePart);
        matches.push({ type: 'DOB', value: datePart, index: dateIndex, length: datePart.length });
      }
    }
  }
  collect(PATTERNS.DOB_WRITTEN(), 'DOB');
  collect(PATTERNS.DOB_NUMERIC(), 'DOB');

  // — Names: capture only the name portion (group 1) —
  {
    const re = PATTERNS.NAMES_PREFIXED();
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const namePart = m[1];
      if (namePart) {
        const nameIndex = m.index + m[0].indexOf(namePart);
        matches.push({ type: 'NAME', value: namePart, index: nameIndex, length: namePart.length });
      }
    }
  }

  // ===  Redaction pass (independent of collection) ===
  let redacted = content;

  // DOB: apply in the same three-pass order so specificity is preserved
  // Pass 1: replace the date portion within a prefixed context
  redacted = redacted.replace(
    PATTERNS.DOB_PREFIXED(),
    (match, dateGroup) => match.replace(dateGroup, '[DOB_REMOVED]')
  );
  // Pass 2: written-month dates
  redacted = redacted.replace(PATTERNS.DOB_WRITTEN(), '[DOB_REMOVED]');
  // Pass 3: remaining plain numeric dates
  redacted = redacted.replace(PATTERNS.DOB_NUMERIC(), '[DOB_REMOVED]');

  // Other PII
  redacted = redacted.replace(PATTERNS.NHS_NUMBER(), '[NHS_NUMBER]');
  redacted = redacted.replace(PATTERNS.UK_PHONE(), '[PHONE_NUMBER]');
  redacted = redacted.replace(PATTERNS.UK_POSTCODE(), '[POSTCODE]');
  redacted = redacted.replace(PATTERNS.EMAIL(), '[EMAIL_REMOVED]');
  redacted = redacted.replace(
    PATTERNS.NAMES_PREFIXED(),
    (match, namePart) => match.replace(namePart, '[NAME]')
  );

  // Deduplicate by index (three DOB passes may have overlapping captures)
  const seen = new Set<number>();
  const deduped = matches.filter(m => {
    if (seen.has(m.index)) return false;
    seen.add(m.index);
    return true;
  }).sort((a, b) => a.index - b.index);

  return {
    content: redacted,
    piiDetected: deduped.length > 0,
    matches: deduped,
    metadata: {
      nhsNumbersFound: deduped.filter(m => m.type === 'NHS_NUMBER').length,
      phoneNumbersFound: deduped.filter(m => m.type === 'PHONE').length,
      postcodesFound: deduped.filter(m => m.type === 'POSTCODE').length,
      dobsFound: deduped.filter(m => m.type === 'DOB').length,
      namesFound: deduped.filter(m => m.type === 'NAME').length,
      emailsFound: deduped.filter(m => m.type === 'EMAIL').length,
    },
  };
}

export const AIRLOCK_METADATA = {
  version: '1.1.0',
  compliance: ['GDPR', 'DCB0129'],
  lastUpdated: '2026-05-24',
  changelog: ['v1.1.0: DOB detection fixed — now catches prefixed, numeric, and written-month formats'],
};

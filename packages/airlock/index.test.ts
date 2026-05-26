import { sanitize } from './index.js';

describe('Airlock Engine PII Anonymisation', () => {
  it('should redact NHS numbers', () => {
    const result = sanitize('Patient NHS number is 123 456 7890.');
    expect(result.content).toBe('Patient NHS number is [NHS_NUMBER].');
    expect(result.metadata.nhsNumbersFound).toBe(1);
    expect(result.piiDetected).toBe(true);
  });

  it('should redact UK phone numbers', () => {
    const result = sanitize('Call the patient at 07700 900077.');
    expect(result.content).toBe('Call the patient at [PHONE_NUMBER].');
    expect(result.metadata.phoneNumbersFound).toBe(1);
  });

  it('should redact UK postcodes', () => {
    const result = sanitize('The patient lives at SW1A 1AA.');
    expect(result.content).toBe('The patient lives at [POSTCODE].');
    expect(result.metadata.postcodesFound).toBe(1);
  });

  it('should redact Dates of Birth', () => {
    const text = 'Patient DOB: 12/05/1980 and another is 12-05-80. Also 12 May 1980.';
    const result = sanitize(text);
    expect(result.content).toBe('Patient DOB: [DOB_REMOVED] and another is [DOB_REMOVED]. Also [DOB_REMOVED].');
    expect(result.metadata.dobsFound).toBe(3);
    expect(result.piiDetected).toBe(true);
  });

  it('should redact prefixed names', () => {
    const text = 'Name: John Smith presented with chest pain. Patient Jane Doe was treated by Mr Andrew Jenkins.';
    const result = sanitize(text);
    expect(result.content).toBe('Name: [NAME] presented with chest pain. Patient [NAME] was treated by Mr [NAME].');
    expect(result.metadata.namesFound).toBe(3);
    expect(result.piiDetected).toBe(true);
  });

  it('should handle text with no PII', () => {
    const text = 'The patient presented with a headache and was given Paracetamol 1g PO.';
    const result = sanitize(text);
    expect(result.content).toBe(text);
    expect(result.piiDetected).toBe(false);
  });
});

import { 
  TraumaMechanism, 
  TraumaSessionState 
} from './types';
import { 
  generateATMISTERNarrative, 
  generateMETHANENarrative, 
  calculateCriticality,
  getTop10Prompts
} from './logic';

const mockTraumaSession: TraumaSessionState = {
  id: 'test-123',
  startTime: '2026-03-26T19:00:00Z',
  demographics: {
    age: 45,
    ageUnit: 'years',
    sex: 'Male',
    pregnant: false
  },
  scene: {
    safety: true,
    ppeApplied: true,
    mechanism: TraumaMechanism.RTC,
    environment: { access: true, weather: 'Dry', light: 'Daylight' },
    numberOfPatients: 1,
    extraResources: { senior: true, airAmbulance: false, multiCrew: true },
    locationName: 'M25 Junction 10'
  },
  primarySurvey: {
    catastrophicHaemorrhage: { present: true, interventions: ['tourniquet'] },
    airway: { status: 'clear', adjuncts: [] },
    breathing: { rate: 3, effort: 'normal', twelveMnemonic: true },
    circulation: { pulse: 'weak', capRefill: 4, perfusion: 'pale', ivAccess: true, txaGiven: true },
    disability: { gcs: { eye: 2, verbal: 3, motor: 4, total: 9 }, pupils: 'equal', bloodGlucose: 5.4 },
    exposure: { wounds: ['Laceration to R Thigh'], isTrapped: false }
  },
  entrapment: { isEntrapped: false, level: 'none' },
  immobilisation: { scoop: true, longboard: false, collar: true }
};

describe('Trauma Logic Engine', () => {
  test('calculateCriticality returns RED for GCS 9 and Catastrophic Haem', () => {
    expect(calculateCriticality(mockTraumaSession)).toBe('red');
  });

  test('generateATMISTERNarrative correctly builds injuries and treatment', () => {
    const handover = generateATMISTERNarrative(mockTraumaSession);
    expect(handover.injuries).toContain('Catastrophic Haemorrhage');
    expect(handover.treatment).toContain('TXA Given');
    expect(handover.treatment).toContain('tourniquet');
    expect(handover.requirements).toContain('Senior Support');
  });

  test('generateMETHANENarrative correctly builds METHANE fields', () => {
    const methane = generateMETHANENarrative(mockTraumaSession);
    expect(methane.exactLocation).toBe('M25 Junction 10');
    expect(methane.typeOfIncident).toBe(TraumaMechanism.RTC);
    expect(methane.emergencyServices).toContain('Senior Paramedic');
  });

  test('getTop10Prompts returns RTC specific items', () => {
    const prompts = getTop10Prompts(TraumaMechanism.RTC);
    expect(prompts.some(p => p.type === 'Multi-System RTC')).toBe(true);
  });
});

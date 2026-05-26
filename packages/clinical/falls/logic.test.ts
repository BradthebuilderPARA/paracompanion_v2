import { calculateFallsRisk, FallsAssessment } from '../index';

describe('Falls Risk Logic', () => {
  const baseAssessment: FallsAssessment = {
    splat: {
      symptoms: [],
      previousFalls: 0,
      fearOfFalling: false,
      location: 'Living area',
      activity: 'Walking',
      timeOfDay: 'morning'
    },
    riskFactors: {
      extrinsic: [],
      intrinsic: []
    },
    frailtyScale: 1,
    mobilityStatus: 'full',
    hasHeadInjury: false,
    onAnticoagulants: false,
    hasLossOfConsciousness: false,
    hasNeckBackPain: false,
    hasRedFlags: false,
    isWitnessed: true,
    timestamp: new Date().toISOString()
  };

  test('Stable patient without red flags stays in community', () => {
    const result = calculateFallsRisk(baseAssessment);
    expect(result.conveyance).toBe('community');
    expect(result.isTimeCritical).toBe(false);
  });

  test('Head injury + Anticoagulants triggers hospital conveyance', () => {
    const assessment: FallsAssessment = {
      ...baseAssessment,
      hasHeadInjury: true,
      onAnticoagulants: true
    };
    const result = calculateFallsRisk(assessment);
    expect(result.conveyance).toBe('hospital');
    expect(result.isTimeCritical).toBe(true);
    expect(result.reason).toContain('Head injury + Anticoagulants');
  });

  test('Mobility failure triggers hospital conveyance', () => {
    const assessment: FallsAssessment = {
      ...baseAssessment,
      mobilityStatus: 'unable'
    };
    const result = calculateFallsRisk(assessment);
    expect(result.conveyance).toBe('hospital');
    expect(result.reason).toContain('Unable to weight-bear');
  });

  test('Significant postural drop triggers hospital conveyance', () => {
    const assessment: FallsAssessment = {
      ...baseAssessment,
      posturalHypotension: {
        lyingBP: { systolic: 150, diastolic: 90 },
        standing1MinBP: { systolic: 120, diastolic: 80 }, // >20mmHg drop
        symptomsPresent: false
      }
    };
    const result = calculateFallsRisk(assessment);
    expect(result.conveyance).toBe('hospital');
    expect(result.reason).toContain('Postural Hypotension');
  });

  test('High frailty (CFS 7) triggers hospital consideration', () => {
    const assessment: FallsAssessment = {
      ...baseAssessment,
      frailtyScale: 7
    };
    const result = calculateFallsRisk(assessment);
    expect(result.conveyance).toBe('hospital');
    expect(result.reason).toContain('Severe Frailty');
  });
});

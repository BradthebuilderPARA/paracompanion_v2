import { calculateNEWS2, NEWS2Params } from './index';

describe('NEWS2 Scoring Logic', () => {
  const baseVitals: NEWS2Params = {
    respirationRate: 20,
    spO2: 98,
    spO2Scale: 'scale1',
    airOrOxygen: 'air',
    systolicBP: 120,
    pulseRate: 70,
    consciousness: 'A',
    temperature: 36.6,
  };

  test('Normal vitals give score of 0', () => {
    const result = calculateNEWS2(baseVitals);
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe('low');
  });

  test('Hypoxia on Scale 1 gives correct score', () => {
    const result = calculateNEWS2({ ...baseVitals, spO2: 90 });
    expect(result.parameterScores.spO2).toBe(3);
    expect(result.score).toBe(3); // Only SpO2 scores
  });

  test('Oxygen support adds 2 points', () => {
    const result = calculateNEWS2({ ...baseVitals, airOrOxygen: 'oxygen' });
    expect(result.parameterScores.airOrOxygen).toBe(2);
    expect(result.score).toBe(2);
  });

  test('Scale 2 (COPD) Target Range (88-92%) scores 0', () => {
    const vitals: NEWS2Params = {
      ...baseVitals,
      spO2Scale: 'scale2',
      spO2: 90,
      airOrOxygen: 'oxygen'
    };
    const result = calculateNEWS2(vitals);
    // SpO2 90 on Scale 2 is 0. Oxygen is 2. Total = 2.
    expect(result.parameterScores.spO2).toBe(0);
    expect(result.score).toBe(2);
  });

  test('Scale 2 (COPD) High SpO2 on Oxygen scores 3', () => {
    const vitals: NEWS2Params = {
      ...baseVitals,
      spO2Scale: 'scale2',
      spO2: 98,
      airOrOxygen: 'oxygen'
    };
    const result = calculateNEWS2(vitals);
    // SpO2 98 on Scale 2 + Oxygen = 3. Oxygen = 2. Total = 5.
    expect(result.parameterScores.spO2).toBe(3);
    expect(result.score).toBe(5);
  });

  test('Extreme Tachycardia scores 3', () => {
    const result = calculateNEWS2({ ...baseVitals, pulseRate: 140 });
    expect(result.parameterScores.pulseRate).toBe(3);
    expect(result.score).toBe(3);
  });

  test('Unconsciousness scores 3', () => {
    const result = calculateNEWS2({ ...baseVitals, consciousness: 'U' });
    expect(result.parameterScores.consciousness).toBe(3);
    expect(result.score).toBe(3);
  });

  test('High risk threshold (Score >= 7)', () => {
    const vitals: NEWS2Params = {
      ...baseVitals,
      respirationRate: 26, // 3
      spO2: 88,            // 3
      airOrOxygen: 'oxygen' // 2
    };
    const result = calculateNEWS2(vitals);
    expect(result.score).toBe(8);
    expect(result.riskLevel).toBe('high');
  });

  test('Medium risk threshold (Score 5-6 or any 3)', () => {
    const vitals: NEWS2Params = {
      ...baseVitals,
      respirationRate: 25, // 3
    };
    const result = calculateNEWS2(vitals);
    expect(result.score).toBe(3);
    expect(result.riskLevel).toBe('medium'); // Because it has a score of 3
  });
});

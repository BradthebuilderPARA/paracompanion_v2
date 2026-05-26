import { calculateMOEWS, MOEWSParams } from './index';

describe('MOEWS Clinical Logic', () => {
  const baseParams: MOEWSParams = {
    respirationRate: 18,
    spO2: 98,
    onOxygen: false,
    systolicBP: 120,
    diastolicBP: 70,
    pulseRate: 80,
    temperature: 36.5,
    acvpu: 'A',
    isPostpartum: false,
    redFlags: {}
  };

  test('Normal vitals should score 0 and low risk', () => {
    const result = calculateMOEWS(baseParams);
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe('low');
  });

  test('Pulse rate threshold switches at 48h postpartum', () => {
    // 115 bpm is Amber for Pregnant or < 48h Postpartum (Range 113-121)
    // 115 bpm is Red for > 48h Postpartum (Range > 107)
    
    const pregnantParams = { ...baseParams, pulseRate: 115, isPostpartum: false };
    const earlyPostpartum = { ...baseParams, pulseRate: 115, isPostpartum: true, postpartumHours: 24 };
    const latePostpartum = { ...baseParams, pulseRate: 115, isPostpartum: true, postpartumHours: 72 };

    const res1 = calculateMOEWS(pregnantParams);
    const res2 = calculateMOEWS(earlyPostpartum);
    const res3 = calculateMOEWS(latePostpartum);

    expect(res1.flags.pulseRate).toBe('amber');
    expect(res2.flags.pulseRate).toBe('amber');
    expect(res3.flags.pulseRate).toBe('red');
  });

  test('Red flag symptoms trigger critical status', () => {
    const paramsWithFlag = { 
      ...baseParams, 
      redFlags: { severeHeadache: true } 
    };
    const result = calculateMOEWS(paramsWithFlag);
    expect(result.isCritical).toBe(true);
    expect(result.isTimeCritical).toBe(true);
  });

  test('Two amber parameters trigger time critical status', () => {
    const twoAmbers = {
      ...baseParams,
      respirationRate: 23, // Amber
      pulseRate: 115, // Amber (pregnant contextual)
    };
    const result = calculateMOEWS(twoAmbers);
    expect(result.score).toBe(4); // 2 + 2
    expect(result.isTimeCritical).toBe(true);
  });

  test('High risk score threshold', () => {
    const highRisk = {
      ...baseParams,
      systolicBP: 150, // Red (3)
      diastolicBP: 100, // Red (3)
      respirationRate: 23, // Amber (2)
    };
    const result = calculateMOEWS(highRisk);
    expect(result.score).toBe(8);
    expect(result.riskLevel).toBe('high');
  });
});

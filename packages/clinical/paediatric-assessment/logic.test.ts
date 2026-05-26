import { assessPaediatric, getPaediatricAgeBand } from './logic';

describe('Paediatric Assessment Logic', () => {
  it('correctly calculates age band', () => {
    expect(getPaediatricAgeBand(6)).toBe('<1 year');
    expect(getPaediatricAgeBand(18)).toBe('1-2 yrs');
    expect(getPaediatricAgeBand(48)).toBe('2-5 yrs');
    expect(getPaediatricAgeBand(120)).toBe('5-12 yrs');
    expect(getPaediatricAgeBand(150)).toBe('Over 12 yrs');
  });

  it('identifies green traffic light for normal vitals', () => {
    const result = assessPaediatric({
      ageInMonths: 24, // 2-5 yrs
      respirationRate: 28, // normal (25-30)
      heartRate: 110, // normal (95-140)
      temperature: 36.5,
      activity: 'normal',
      skinColour: 'normal'
    });

    expect(result.trafficLight).toBe('green');
    expect(result.redFlagsTriggered.length).toBe(0);
    expect(result.amberFlagsTriggered.length).toBe(0);
  });

  it('identifies red flags for severe conditions', () => {
    const result = assessPaediatric({
      ageInMonths: 4,
      grunting: true,
      skinColour: 'pale_mottled_cyanotic',
      nonBlanchingRash: true
    });

    expect(result.trafficLight).toBe('red');
    expect(result.redFlagsTriggered).toContain('Grunting');
    expect(result.redFlagsTriggered).toContain('Pale/mottled/cyanotic skin');
    expect(result.redFlagsTriggered).toContain('Non-blanching rash');
  });

  it('flags amber for moderate tachycardia and tachypnoea', () => {
    const result = assessPaediatric({
      ageInMonths: 8, // <12 months
      heartRate: 165, // >160 is amber
      respirationRate: 55 // >50 is amber for 6-12m
    });

    expect(result.trafficLight).toBe('amber');
    expect(result.amberFlagsTriggered).toContain('Tachycardia >160 bpm (<12 months)');
    expect(result.amberFlagsTriggered).toContain('Tachypnoea >50 bpm (6-12 months)');
  });

  it('triggers red flag for <3 months with fever >= 38', () => {
    const result = assessPaediatric({
      ageInMonths: 2,
      temperature: 38.2
    });

    expect(result.trafficLight).toBe('red');
    expect(result.redFlagsTriggered).toContain('Age <3 months with Temperature ≥38°C');
  });
});

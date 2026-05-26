import { PaediatricAgeBand, PaediatricAssessmentParams, PaediatricAssessmentResult, TrafficLightRisk } from './types';

export function getPaediatricAgeBand(ageInMonths: number): PaediatricAgeBand {
  if (ageInMonths < 12) return '<1 year';
  if (ageInMonths < 24) return '1-2 yrs';
  if (ageInMonths < 60) return '2-5 yrs';
  if (ageInMonths < 144) return '5-12 yrs';
  return 'Over 12 yrs';
}

export function getExpectedVitals(ageBand: PaediatricAgeBand): { rr: [number, number], hr: [number, number] } {
  switch (ageBand) {
    case '<1 year': return { rr: [40, 60], hr: [110, 160] };
    case '1-2 yrs': return { rr: [25, 35], hr: [110, 150] };
    case '2-5 yrs': return { rr: [25, 30], hr: [95, 140] };
    case '5-12 yrs': return { rr: [20, 25], hr: [80, 120] };
    case 'Over 12 yrs': return { rr: [15, 20], hr: [60, 100] };
    default: return { rr: [15, 20], hr: [60, 100] }; // Fallback
  }
}

export function assessPaediatric(params: PaediatricAssessmentParams): PaediatricAssessmentResult {
  const ageBand = getPaediatricAgeBand(params.ageInMonths);
  const expected = getExpectedVitals(ageBand);
  
  let isNormalHR = true;
  let isNormalRR = true;

  if (params.heartRate) {
    isNormalHR = params.heartRate >= expected.hr[0] && params.heartRate <= expected.hr[1];
  }
  
  if (params.respirationRate) {
    isNormalRR = params.respirationRate >= expected.rr[0] && params.respirationRate <= expected.rr[1];
  }

  const redFlags: string[] = [];
  const amberFlags: string[] = [];

  // Traffic Light - RED
  if (params.skinColour === 'pale_mottled_cyanotic') redFlags.push('Pale/mottled/cyanotic skin');
  if (params.activity === 'ill_appearing') redFlags.push('Appears ill to a healthcare professional');
  if (params.activity === 'does_not_wake') redFlags.push('Does not wake or if roused does not stay awake');
  if (params.activity === 'weak_high_pitched_cry') redFlags.push('Weak, high-pitched or continuous cry');
  if (params.grunting) redFlags.push('Grunting');
  if (params.respirationRate && params.respirationRate > 60) redFlags.push('Tachypnoea >60 bpm');
  if (params.chestIndrawing === 'moderate' || params.chestIndrawing === 'severe') redFlags.push('Moderate or severe chest indrawing');
  if (params.temperature && params.ageInMonths < 3 && params.temperature >= 38) redFlags.push('Age <3 months with Temperature ≥38°C');
  if (params.nonBlanchingRash) redFlags.push('Non-blanching rash');
  if (params.bulgingFontanelle) redFlags.push('Bulging fontanelle');
  if (params.neckStiffness) redFlags.push('Neck stiffness');
  if (params.statusEpilepticus) redFlags.push('Status epilepticus');
  if (params.focalNeurological) redFlags.push('Focal neurological signs or focal seizures');

  // Traffic Light - AMBER
  if (params.skinColour === 'pallor_reported') amberFlags.push('Pallor reported by parent/carer');
  if (params.activity === 'not_responding_socially') amberFlags.push('Not responding normally to social cues');
  if (params.activity === 'wakes_only_prolonged') amberFlags.push('Wakes only with prolonged stimulation');
  if (params.activity === 'decreased_activity') amberFlags.push('Decreased activity');
  
  if (params.nasalFlaring) amberFlags.push('Nasal flaring');
  if (params.crackles) amberFlags.push('Crackles in the chest');
  if (params.spO2 && params.spO2 <= 95) amberFlags.push('Oxygen saturation ≤95% in air');

  if (params.respirationRate) {
    if (params.ageInMonths >= 6 && params.ageInMonths <= 12 && params.respirationRate > 50 && params.respirationRate <= 60) {
      amberFlags.push('Tachypnoea >50 bpm (6-12 months)');
    } else if (params.ageInMonths > 12 && params.respirationRate > 40 && params.respirationRate <= 60) {
      amberFlags.push('Tachypnoea >40 bpm (>12 months)');
    }
  }

  if (params.heartRate) {
    if (params.ageInMonths < 12 && params.heartRate > 160) amberFlags.push('Tachycardia >160 bpm (<12 months)');
    else if (params.ageInMonths >= 12 && params.ageInMonths < 24 && params.heartRate > 150) amberFlags.push('Tachycardia >150 bpm (12-24 months)');
    else if (params.ageInMonths >= 24 && params.ageInMonths < 60 && params.heartRate > 140) amberFlags.push('Tachycardia >140 bpm (2-5 years)');
  }

  if (params.capillaryRefillTime && params.capillaryRefillTime >= 3) amberFlags.push('Capillary refill time ≥3 seconds');
  if (params.hydration === 'dry_mucous') amberFlags.push('Dry mucous membranes');
  if (params.hydration === 'poor_feeding') amberFlags.push('Poor feeding in infants');
  if (params.hydration === 'reduced_urine') amberFlags.push('Reduced urine output');
  if (params.hydration === 'reduced_turgor') amberFlags.push('Reduced skin turgor');

  if (params.ageInMonths >= 3 && params.ageInMonths <= 6 && params.temperature && params.temperature >= 39) {
    amberFlags.push('Age 3-6 months with Temperature ≥39°C');
  }
  
  if (params.feverFor5Days) amberFlags.push('Fever for ≥5 days');
  if (params.rigors) amberFlags.push('Rigors');
  if (params.swellingLimbJoint) amberFlags.push('Swelling of a limb or joint');
  if (params.nonWeightBearing) amberFlags.push('Non-weight-bearing limb/not using an extremity');

  let trafficLight: TrafficLightRisk = 'green';
  if (redFlags.length > 0) trafficLight = 'red';
  else if (amberFlags.length > 0) trafficLight = 'amber';

  return {
    ageBand,
    trafficLight,
    redFlagsTriggered: redFlags,
    amberFlagsTriggered: amberFlags,
    isNormalHR,
    isNormalRR,
    expectedHRRange: `${expected.hr[0]}-${expected.hr[1]}`,
    expectedRRRange: `${expected.rr[0]}-${expected.rr[1]}`,
  };
}

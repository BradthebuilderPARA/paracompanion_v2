import { calculate4ATScore, calculateMHRisk } from './mental-health/logic';
import { MentalHealthSession } from './mental-health/types';

const mockSession: MentalHealthSession = {
  absm: {
    appearance: 'well',
    behaviour: 'calm',
    eyeContact: 'normal',
    psychomotor: 'normal',
    speechRate: 'normal',
    speechVolume: 'normal',
    speechCoherence: 'coherent',
    speechPressure: false,
    mood: 'normal',
    affect: 'congruent',
    orientation: { time: true, place: true, person: true },
    attention: 'intact',
    memory: 'intact',
    deliriumSuspected: false,
  },
  fourAT: {
    alertness: 0,
    amt4: { age: true, dob: true, place: true, year: true },
    attention: 0,
    acuteChange: 0,
  },
  fullMse: {
    thoughtProcess: 'linear',
    thoughtContent: { delusions: false, obsessions: false, suicidalIdeation: 'none', homicidalIdeation: false },
    perception: { hallucinations: false, commandHallucinations: false },
    insight: 'good',
    judgement: 'intact',
  },
  risk: {
    toSelf: { suicide: false, selfHarm: false, selfNeglect: false, substanceUse: false, accidentalInjury: false },
    toOthers: { aggression: false, violence: false, neglectOfDependants: false },
    fromOthers: { abuse: false, exploitation: false, radicalisation: false, victimisation: false },
    protectiveFactors: [],
  },
  capacity: { understands: true, retains: true, weighs: true, communicates: true, hasCapacity: true },
  physicalHealth: { vitalsLinked: true, headInjury: false, intoxication: false },
  notes: '',
};

describe('Mental Health Logic', () => {
  test('4AT Score: Normal', () => {
    expect(calculate4ATScore(mockSession.fourAT)).toBe(0);
  });

  test('4AT Score: Abnormal Alertness', () => {
    const session = { ...mockSession, fourAT: { ...mockSession.fourAT, alertness: 4 as 0 | 4 } };
    expect(calculate4ATScore(session.fourAT)).toBe(4);
  });

  test('4AT Score: Mixed Errors', () => {
    const session = { 
      ...mockSession, 
      fourAT: { 
        ...mockSession.fourAT, 
        amt4: { age: false, dob: false, place: true, year: true }, // 2 errors = 2 points
        attention: 1 as 0 | 1 | 2
      } 
    };
    expect(calculate4ATScore(session.fourAT)).toBe(3);
  });

  test('Risk: High due to active suicide intent', () => {
    const session = { 
      ...mockSession, 
      fullMse: { 
        ...mockSession.fullMse, 
        thoughtContent: { ...mockSession.fullMse.thoughtContent, suicidalIdeation: 'active' as const } 
      } 
    };
    expect(calculateMHRisk(session).riskLevel).toBe('high');
  });

  test('Risk: High due to potential delirium', () => {
    const session = { ...mockSession, fourAT: { ...mockSession.fourAT, acuteChange: 4 as 0 | 4 } };
    expect(calculateMHRisk(session).riskLevel).toBe('high');
  });

  test('Risk: Moderate due to hallucinations', () => {
    const session = { 
      ...mockSession, 
      fullMse: { 
        ...mockSession.fullMse, 
        perception: { ...mockSession.fullMse.perception, hallucinations: true } 
      } 
    };
    expect(calculateMHRisk(session).riskLevel).toBe('moderate');
  });
});

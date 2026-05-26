import { calculateGCS } from '../index';
import { 
  TraumaSessionState, 
  ATMISTER, 
  METHANE, 
  Top10TraumaPrompt, 
  TraumaMechanism 
} from './types';

export const UK_TRAUMA_TOP_10: Top10TraumaPrompt[] = [
  {
    id: 1,
    type: 'Silver Head Injury',
    considerations: ['Ground-level fall ≥65', 'check anticoagulant', 'urgent CT per NICE CG176'],
    triggers: [TraumaMechanism.FALL]
  },
  {
    id: 2,
    type: 'Multi-System RTC',
    considerations: ['High-energy impact', 'Platinum 10 mins', 'pelvic/internal haemorrhage focus'],
    triggers: [TraumaMechanism.RTC]
  },
  {
    id: 3,
    type: 'Proximal Femur Fracture',
    considerations: ['Low-energy elderly fall', 'analgesia', 'pressure sore prevention'],
    triggers: [TraumaMechanism.FALL]
  },
  {
    id: 4,
    type: 'Penetrating Torso',
    considerations: ['Catastrophic haemorrhage', 'scoop & run to MTC'],
    triggers: [TraumaMechanism.PENETRATING]
  },
  {
    id: 5,
    type: 'TBI – Young Adult',
    considerations: ['Maintain cerebral perfusion', 'SBP >110 mmHg', 'avoid hypoxia/hypotension'],
    triggers: [TraumaMechanism.BLUNT]
  },
  {
    id: 6,
    type: 'Chest Trauma',
    considerations: ['Identify tension pneumothorax', 'intervention only if obstructive shock'],
    triggers: [TraumaMechanism.BLUNT, TraumaMechanism.PENETRATING]
  },
  {
    id: 7,
    type: 'Pedestrian vs Vehicle',
    considerations: ['High suspicion pelvic/spinal injuries', 'triggers MTC pre-alert'],
    triggers: [TraumaMechanism.RTC]
  },
  {
    id: 8,
    type: 'Fall >2m',
    considerations: ['Axial loading injuries', 'calcaneal + lumbar fractures'],
    triggers: [TraumaMechanism.FALL]
  },
  {
    id: 9,
    type: 'Open/Complex Limb Fractures',
    considerations: ['Early antibiotics', 'splinting', 'restore distal pulses'],
    triggers: [TraumaMechanism.BLUNT, TraumaMechanism.CRUSH]
  },
  {
    id: 10,
    type: 'Traumatic Cardiac Arrest',
    considerations: ['HOT principles', 'Haemorrhage, Oxygenation, Tension Pneumothorax'],
    triggers: [TraumaMechanism.BLUNT, TraumaMechanism.PENETRATING, TraumaMechanism.CRUSH]
  }
];

export function generateATMISTERNarrative(state: TraumaSessionState): ATMISTER {
  const { demographics, scene, primarySurvey, entrapment, immobilisation } = state;
  const signs = state.primarySurvey;

  // Injuries
  const injuriesList = [...(primarySurvey.exposure.wounds || [])];
  if (primarySurvey.catastrophicHaemorrhage.present) injuriesList.push('Catastrophic Haemorrhage');
  if (entrapment.isEntrapped) injuriesList.push(`Entrapped (${entrapment.level})`);
  
  // Signs
  const signsNarrative = `GCS ${signs.disability.gcs.total}, Pupils ${signs.disability.pupils}, Skin ${signs.circulation.perfusion}, CRT ${signs.circulation.capRefill}s.`;

  // Treatments
  const treatments = [];
  if (primarySurvey.catastrophicHaemorrhage.interventions.length > 0) {
    treatments.push(`Haem. Control: ${primarySurvey.catastrophicHaemorrhage.interventions.join(', ')}`);
  }
  if (primarySurvey.airway.adjuncts.length > 0) {
    treatments.push(`Airway: ${primarySurvey.airway.adjuncts.join(', ')}`);
  }
  if (primarySurvey.circulation.txaGiven) treatments.push('TXA Given');
  if (immobilisation.scoop) treatments.push('Scoop');
  if (immobilisation.collar) treatments.push('Collar');

  return {
    ageSex: `${demographics.age}yo ${demographics.sex}${demographics.pregnant ? ' (Pregnant)' : ''}`,
    timeOfIncident: state.startTime,
    mechanism: scene.mechanism,
    injuries: injuriesList.join(', ') || 'No catastrophic injuries noted',
    signs: signsNarrative,
    treatment: treatments.join(', ') || 'Standard life support',
    eta: 'TBC - See Navigation',
    requirements: [
      scene.extraResources.senior ? 'Senior Support' : null,
      scene.extraResources.airAmbulance ? 'HEMS' : null,
      state.entrapment.isEntrapped ? 'Extrication' : null
    ].filter(Boolean).join(', ') || 'None'
  };
}

export function generateMETHANENarrative(state: TraumaSessionState): METHANE {
  const { scene, primarySurvey, entrapment } = state;

  return {
    majorIncident: scene.mechanism === TraumaMechanism.CRUSH || scene.numberOfPatients > 2,
    exactLocation: scene.locationName || 'Location Not Specified',
    typeOfIncident: scene.mechanism,
    hazards: [], // Manual input in UI
    access: scene.environment.access ? 'Good' : 'Restricted',
    numberSeverity: `${scene.numberOfPatients} patients. Criticality: ${calculateCriticality(state).toUpperCase()}`,
    emergencyServices: [
        scene.extraResources.senior ? 'Senior Paramedic' : null,
        scene.extraResources.airAmbulance ? 'Air Ambulance' : null,
        entrapment.isEntrapped ? 'Fire & Rescue' : null
    ].filter(Boolean) as string[]
  };
}

export function calculateCriticality(state: TraumaSessionState): 'red' | 'amber' | 'green' {
  const { primarySurvey } = state;

  if (
    primarySurvey.catastrophicHaemorrhage.present ||
    primarySurvey.airway.status === 'obstructed' ||
    primarySurvey.disability.gcs.total < 9
  ) {
    return 'red';
  }

  if (
    primarySurvey.circulation.pulse === 'weak' ||
    primarySurvey.disability.gcs.total < 13 ||
    primarySurvey.breathing.effort !== 'normal'
  ) {
    return 'amber';
  }

  return 'green';
}

export function getTop10Prompts(mechanism: TraumaMechanism): Top10TraumaPrompt[] {
  return UK_TRAUMA_TOP_10.filter(p => p.triggers.includes(mechanism));
}

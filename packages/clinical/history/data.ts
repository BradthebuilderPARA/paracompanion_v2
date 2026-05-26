import { HistoryPresentation } from './types';

export const PRESENTATION_DATA: Record<string, HistoryPresentation> = {
  chest_pain: {
    key: 'chest_pain',
    label: 'Chest Pain Assessment',
    keywords: ['CCP', 'Angina', 'MI', 'Cardiac'],
    redFlags: [
      { id: 'shock', label: 'Signs indicating Shock (Pallor/Sweaty/Hypotensive)', status: null },
      { id: 'sob', label: 'Acutely Short of Breath', status: null },
      { id: 'airway', label: 'Airway Compromise / Stridor', status: null },
      { id: 'syncope', label: 'Associated Syncope / Collapse', status: null }
    ],
    questions: [
      { id: 'onset', question: 'Onset: Activity at time of onset?', chips: ['At rest', 'On exertion', 'Sudden', 'Gradual'] },
      { id: 'character', question: 'Character: Description of pain?', chips: ['Heaviness', 'Pressure', 'Sharp', 'Tearing', 'Dull ache'] },
      { id: 'radiation', question: 'Radiation: Arm, jaw, back?', chips: ['Left arm', 'Both arms', 'Jaw', 'Shoulders', 'Back', 'None'] },
      { id: 'associated', question: 'Associated: Nausea, Sweating?', chips: ['Nausea', 'Vomiting', 'Diaphoresis', 'Dizziness'] },
      { id: 'history', question: 'History: Cardiac risk factors?', chips: ['HTN', 'Diabetes', 'Smoker', 'Family Hx', 'High Cholesterol'] }
    ]
  },
  palpitations: {
    key: 'palpitations',
    label: 'Palpitations',
    keywords: ['Heart Racing', 'Flutters', 'Arrhythmia', 'AF'],
    redFlags: [
      { id: 'hemodynamic', label: 'Hemodynamic Instability / Shock', status: null },
      { id: 'syncope', label: 'Syncope at time of onset', status: null },
      { id: 'chest_pain', label: 'Associated Chest Pain', status: null },
      { id: 'hf', label: 'Acute Heart Failure / Pulmonary Oedema', status: null }
    ],
    questions: [
      { id: 'rate', question: 'Rate: Constant or intermittent?', chips: ['Constant', 'Intermittent', 'Paroxysmal'] },
      { id: 'trigger', question: 'Triggers: Caffeine, exercise, stress?', chips: ['Caffeine', 'Exercise', 'Stress', 'Alcohol', 'None'] },
      { id: 'duration', question: 'Duration: How long does it last?', chips: ['Seconds', 'Minutes', 'Hours'] }
    ]
  },
  sob: {
    key: 'sob',
    label: 'Shortness of Breath',
    keywords: ['Asthma', 'COPD', 'Dyspnoea', 'SOB'],
    redFlags: [
      { id: 'exhaustion', label: 'Signs of Exhaustion / Silent Chest', status: null },
      { id: 'cyanosis', label: 'Central Cyanosis', status: null },
      { id: 'airway', label: 'Unable to speak in sentences', status: null },
      { id: 'altered', label: 'Altered Mental Status / Agitation', status: null }
    ],
    questions: [
      { id: 'onset', question: 'Onset: Sudden or gradual?', chips: ['Sudden', 'Gradual', 'Post-exertion'] },
      { id: 'position', question: 'Position: Better sitting up?', chips: ['Orthopnea', 'Tripod position', 'No change'] },
      { id: 'cough', question: 'Cough: Productive or dry?', chips: ['Productive (Clear)', 'Productive (Green)', 'Dry hack', 'Hemoptysis'] }
    ]
  },
  anaphylaxis: {
    key: 'anaphylaxis',
    label: 'Anaphylaxis',
    keywords: ['Allergy', 'Sting', 'Reaction', 'Hives'],
    redFlags: [
      { id: 'stridor', label: 'Stridor / Upper Airway Swelling', status: null },
      { id: 'shock', label: 'Hypotension / Signs of Shock', status: null },
      { id: 'wheeze', label: 'Severe Wheeze / Respiratory Distress', status: null },
      { id: 'collapse', label: 'Sudden Collapse / LoC', status: null }
    ],
    questions: [
      { id: 'trigger', question: 'Trigger: Food, drug, sting?', chips: ['Nut', 'Dairy', 'Antibiotic', 'Bee/Wasp', 'Unknown'] },
      { id: 'progression', question: 'Progression: How quickly?', chips: ['Rapid (<5 mins)', 'Moderate (5-30 mins)', 'Gradual'] },
      { id: 'previous', question: 'Previous: History of anaphylaxis?', chips: ['Known allergy', 'First time', 'Carries Epipen'] }
    ]
  },
  stroke: {
    key: 'stroke',
    label: 'Stroke Assessment',
    keywords: ['FAST', 'TIA', 'CVA', 'Neurological'],
    redFlags: [
      { id: 'conscious', label: 'Decreased Level of Consciousness', status: null },
      { id: 'seizure', label: 'Seizure at onset', status: null },
      { id: 'trauma', label: 'Associated Head Trauma', status: null },
      { id: 'headache', label: 'Thunderclap Headache', status: null }
    ],
    questions: [
      { id: 'lkw', question: 'LKW: Time last known well?', chips: ['<4.5 hours', '<24 hours', 'Wake-up stroke', 'Unknown'] },
      { id: 'symptoms', question: 'Symptoms: Face, Arm, Speech?', chips: ['Facial droop', 'Arm weakness', 'Slurred speech', 'Visual field loss'] },
      { id: 'anticoags', question: 'Meds: On anticoagulants?', chips: ['Warfarin', 'DOAC (Apixaban)', 'DOAC (Rivaroxaban)', 'None'] }
    ]
  },
  seizure: {
    key: 'seizure',
    label: 'Seizure',
    keywords: ['Epilepsy', 'Fits', 'Convulsions'],
    redFlags: [
      { id: 'status', label: 'Status Epilepticus (>5 mins / no recovery)', status: null },
      { id: 'trauma', label: 'Injury sustained during seizure', status: null },
      { id: 'hypoglycemia', label: 'Signs indicating Hypoglycemia', status: null },
      { id: 'first', label: 'First ever seizure', status: null }
    ],
    questions: [
      { id: 'duration', question: 'Duration: How long was the fit?', chips: ['<1 min', '1-5 mins', '>5 mins'] },
      { id: 'type', question: 'Type: Tonic-clonic or focal?', chips: ['Tonic-clonic', 'Absence', 'Focal', 'Unknown'] },
      { id: 'post_ictal', question: 'Post-ictal: Confusion/Drowsiness?', chips: ['Confused', 'Drowsy', 'Combative', 'Quick recovery'] }
    ]
  },
  headache: {
    key: 'headache',
    label: 'Headache',
    keywords: ['Migraine', 'Meningitis', 'SAH'],
    redFlags: [
      { id: 'thunderclap', label: 'Sudden onset "Thunderclap" pain', status: null },
      { id: 'meningism', label: 'Stiff neck / Photophobia / Non-blanching rash', status: null },
      { id: 'neuro', label: 'New Neurological Deficit', status: null },
      { id: 'trauma', label: 'Associated with Head Injury', status: null }
    ],
    questions: [
      { id: 'speed', question: 'Speed: Time to max intensity?', chips: ['Instant', 'Seconds', 'Minutes', 'Gradual'] },
      { id: 'location', question: 'Location: Where is the pain?', chips: ['Frontal', 'Occipital', 'Unilateral', 'Generalized'] },
      { id: 'vision', question: 'Vision: Changes or blurry?', chips: ['Blurry', 'Field loss', 'Aura', 'Normal'] }
    ]
  },
  head_injury: {
    key: 'head_injury',
    label: 'Head Injury',
    keywords: ['Fall', 'Trauma', 'Concussion'],
    redFlags: [
      { id: 'loc', label: 'Measured LOC / GCS decrease', status: null },
      { id: 'vomiting', label: 'Vomiting (>1 episode)', status: null },
      { id: 'seizure', label: 'Post-traumatic seizure', status: null },
      { id: 'anticoag', label: 'On anticoagulant medication', status: null }
    ],
    questions: [
      { id: 'mechanism', question: 'Mechanism: Impact/Fall height?', chips: ['Trip/Same level', 'Height >1m', 'RTC', 'Assault'] },
      { id: 'amnesia', question: 'Amnesia: Before or after incident?', chips: ['Retrograde', 'Antegrade', 'None'] },
      { id: 'symptoms', question: 'Symptoms: Dizziness, focal deficit?', chips: ['Dizzy', 'Focal weakness', 'Clear fluid from ear/nose'] }
    ]
  },
  back_pain: {
    key: 'back_pain',
    label: 'Back Pain',
    keywords: ['Sciatica', 'Cauda Equina', 'AAA'],
    redFlags: [
      { id: 'cauda', label: 'Saddle Anesthesia / Bladder or Bowel Dysfunction', status: null },
      { id: 'aaa', label: 'Abdominal Pulsatile Mass / Syncope', status: null },
      { id: 'weakness', label: 'Bilateral Leg Weakness', status: null },
      { id: 'fever', label: 'Associated Fever / Systemic Illness', status: null }
    ],
    questions: [
      { id: 'onset', question: 'Onset: Sudden or heavy lifting?', chips: ['Lifting', 'Sudden', 'Spontaneous'] },
      { id: 'distribution', question: 'Radiation: Down legs?', chips: ['Unilateral leg', 'Bilateral leg', 'Groin', 'None'] },
      { id: 'bladder', question: 'Bladder: Any changes in sensation?', chips: ['Numbness', 'Urinary retention', 'Incontinence', 'Normal'] }
    ]
  },
  falls: {
    key: 'falls',
    label: 'Falls Assessment',
    keywords: ['Trip', 'Collapse', 'Elderly'],
    redFlags: [
      { id: 'hi', label: 'Head Injury with LOC/Vomiting', status: null },
      { id: 'hip', label: 'Shortened / Externally Rotated Limb', status: null },
      { id: 'syncope', label: 'Syncope prior to fall', status: null },
      { id: 'neuro', label: 'New Neurological Deficit', status: null }
    ],
    questions: [
      { id: 'reason', question: 'Reason: Trip or mechanical?', chips: ['Slipped', 'Tripped', 'Dizzy', 'Leg gave way'] },
      { id: 'lie', question: 'Long Lie: How long on floor?', chips: ['<1 hour', '1-4 hours', '>4 hours'] },
      { id: 'mobility', question: 'Mobility: Normal aid usage?', chips: ['Stick', 'Frame', 'Independent', 'Usually immobile'] }
    ]
  },
  abdominal_pain: {
    key: 'abdominal_pain',
    label: 'Abdominal Pain',
    keywords: ['GI', 'Appendicitis', 'AAA', 'Gynae'],
    redFlags: [
      { id: 'shock', label: 'Cold/Clammy/Tachycardic (Shock)', status: null },
      { id: 'rigid', label: 'Rigid / Board-like Abdomen', status: null },
      { id: 'mass', label: 'Pulsatile Abdominal Mass', status: null },
      { id: 'bleeding', label: 'Evidence of GI Bleeding (Melaena/Haematemesis)', status: null }
    ],
    questions: [
      { id: 'location', question: 'Location: Quadrant or diffuse?', chips: ['RUQ', 'RLQ', 'Epigastric', 'Diffuse'] },
      { id: 'period', question: 'AFAB: LMP or pregnancy risk?', chips: ['LMP <4 weeks', 'LMP >4 weeks', 'Positive test', 'Menopause'] },
      { id: 'bowel', question: 'Bowel: Last opened / character?', chips: ['Normal', 'Constipated', 'Diarrhoea', 'Blood in stool'] }
    ]
  },
  sepsis: {
    key: 'sepsis',
    label: 'Sepsis Screening',
    keywords: ['Infection', 'Fever', 'SIRS'],
    redFlags: [
      { id: 'systolic', label: 'SBP < 90mmHg', status: null },
      { id: 'lactate', label: 'Mottled skin / Non-blanching rash', status: null },
      { id: 'anuria', label: 'Anuria / No urine output >18h', status: null },
      { id: 'gcs', label: 'New confusion / Altered mental state', status: null }
    ],
    questions: [
      { id: 'source', question: 'Source: Suspected origin?', chips: ['UTI', 'Chest/LRTI', 'Wound/Skin', 'Abdominal', 'Unknown'] },
      { id: 'fever', question: 'Fever: Rigors or sweats?', chips: ['Rigors', 'Sweats', 'Persistent high temp'] },
      { id: 'meds', question: 'Meds: Immunosuppressed?', chips: ['Chemo', 'Steroids', 'Splenectomy', 'None'] }
    ]
  },
  unwell_child: {
    key: 'unwell_child',
    label: 'Unwell Child',
    keywords: ['Paediatric', 'Fever', 'Lethargy'],
    redFlags: [
      { id: 'conscious', label: 'Reduced consciousness / Lethargy', status: null },
      { id: 'respir', label: 'Severe respiratory distress / Grunting', status: null },
      { id: 'rash', label: 'Non-blanching rash', status: null },
      { id: 'dehydr', label: 'Signs of severe dehydration (Tenting/Sunken fontanelle)', status: null }
    ],
    questions: [
      { id: 'feeding', question: 'Feeding: Intake compared to normal?', chips: ['Normal', 'Reduced >50%', '<50% intake'] },
      { id: 'nappies', question: 'Wet Nappies: Frequency last 24h?', chips: ['Normal (>4)', 'Reduced (1-2)', 'None'] },
      { id: 'cry', question: 'Cry: High pitched or weak?', chips: ['Normal cry', 'Inconsolable', 'Weak grunting'] }
    ]
  },
  mental_health: {
    key: 'mental_health',
    label: 'Mental Health crisis',
    keywords: ['Suicide', 'Self-harm', 'Psychosis'],
    redFlags: [
      { id: 'suicide', label: 'Active suicidal intent / plan', status: null },
      { id: 'violence', label: 'Immediate risk of violence to others', status: null },
      { id: 'physical', label: 'Life-threatening physical injury / overdose', status: null },
      { id: 'delirium', label: 'Sudden onset confusion (Organic cause?)', status: null }
    ],
    questions: [
      { id: 'mood', question: 'Mood: How do you feel today?', chips: ['Low', 'Anxious', 'Elevated', 'Numb'] },
      { id: 'history', question: 'History: Known diagnosis?', chips: ['Depression', 'EUPD', 'Schizophrenia', 'Bipolar', 'None'] },
      { id: 'support', question: 'Support: Any care coordinator?', chips: ['Crisis team', 'GP', 'Psychiatrist', 'No support'] }
    ]
  },
  overdose: {
    key: 'overdose',
    label: 'Overdose / Toxicology',
    keywords: ['Drugs', 'poisoning', 'Tox'],
    redFlags: [
      { id: 'gcs', label: 'GCS decreasing / Airway risk', status: null },
      { id: 'seizure', label: 'Toxin-induced seizure', status: null },
      { id: 'ecg', label: 'Arrhythmia / QTc prolongation', status: null },
      { id: 'vitals', label: 'Severe tachycardia / Brachycardia', status: null }
    ],
    questions: [
      { id: 'substance', question: 'Substances: What was taken?', chips: ['Paracetamol', 'Opioids', 'Benzos', 'Cocaine', 'Multiple'] },
      { id: 'amount', question: 'Amount: Quantity and strength?', chips: ['Therapeutic', 'Supratherapeutic', 'Large quantity'] },
      { id: 'time', question: 'Time: When was it taken?', chips: ['<1 hour', '1-4 hours', '>4 hours', 'Staggered'] }
    ]
  },
  assault: {
    key: 'assault',
    label: 'Assault / Safeguarding',
    keywords: ['Injury', 'Violence', 'GBH'],
    redFlags: [
      { id: 'internal', label: 'Signs of internal bleeding / blunt trauma', status: null },
      { id: 'hi', label: 'Head Injury with LOC', status: null },
      { id: 'weapon', label: 'Weapon used (especially penetrating)', status: null },
      { id: 'danger', label: 'Assailant still on scene / threat to live', status: null }
    ],
    questions: [
      { id: 'safeguarding', question: 'Safeguarding: Vulnerable person?', chips: ['Child', 'Vulnerable adult', 'Domestic abuse', 'No'] },
      { id: 'evidence', question: 'Evidence: Forensics preservation?', chips: ['Bagged hands', 'Not showered', 'Advice given'] },
      { id: 'police', question: 'Police: CAD number provided?', chips: ['Police on scene', 'CAD logged', 'Not reported'] }
    ]
  }
};

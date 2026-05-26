/**
 * UK Licensed Antithrombotics (Clinical Reference: March 2026)
 * Phase 2: Clinical Core - Decision Support
 */

export interface AntithromboticDrug {
  name: string;
  category: 'DOAC' | 'VKA' | 'LMWH' | 'Antiplatelet' | 'Parenteral' | 'Other';
  brandNames?: string[];
  reversalAgent?: string;
  interlockGuidance?: string;
}

export const ANTITHROMBOTIC_REFERENCE: AntithromboticDrug[] = [
  // 1. Oral Anticoagulants (DOACs / NOACs)
  { name: 'Apixaban', category: 'DOAC', brandNames: ['Eliquis'], reversalAgent: 'Andexanet alfa' },
  { name: 'Rivaroxaban', category: 'DOAC', brandNames: ['Xarelto'], reversalAgent: 'Andexanet alfa' },
  { name: 'Edoxaban', category: 'DOAC', brandNames: ['Lixiana'], reversalAgent: 'Andexanet alfa' },
  { name: 'Dabigatran', category: 'DOAC', brandNames: ['Pradaxa'], reversalAgent: 'Idarucizumab (Praxbind)' },

  // 2. Vitamin K Antagonists (VKAs)
  { name: 'Warfarin', category: 'VKA', brandNames: ['Marevan'], reversalAgent: 'Phytomenadione (Vitamin K1), Beriplex' },
  { name: 'Acenocoumarol', category: 'VKA', brandNames: ['Sinthrome'] },
  { name: 'Phenindione', category: 'VKA' },

  // 3. Injectable/Parenteral Anticoagulants
  { name: 'Enoxaparin', category: 'LMWH', brandNames: ['Clexane'] },
  { name: 'Dalteparin', category: 'LMWH', brandNames: ['Fragmin'] },
  { name: 'Tinzaparin', category: 'LMWH', brandNames: ['Innohep'] },
  { name: 'Unfractionated Heparin (UFH)', category: 'Parenteral' },
  { name: 'Fondaparinux', category: 'Parenteral', brandNames: ['Arixtra'] },
  { name: 'Bivalirudin', category: 'Parenteral' },
  { name: 'Argatroban', category: 'Parenteral' },
  { name: 'Danaparoid', category: 'Other' },

  // 4. Antiplatelet Therapies
  { name: 'Aspirin', category: 'Antiplatelet', brandNames: ['Disprin'] },
  { name: 'Clopidogrel', category: 'Antiplatelet', brandNames: ['Plavix'] },
  { name: 'Ticagrelor', category: 'Antiplatelet', brandNames: ['Brilique'] },
  { name: 'Prasugrel', category: 'Antiplatelet', brandNames: ['Efient'] },
  { name: 'Cangrelor', category: 'Antiplatelet', brandNames: ['Kengrexal'] },
  { name: 'Dipyridamole', category: 'Antiplatelet', brandNames: ['Persantin'] },
  { name: 'Cilostazol', category: 'Antiplatelet' },
  
  // 5. Specialist/Hospital Only
  { name: 'Tirofiban', category: 'Parenteral', brandNames: ['Aggrastat'] },
  { name: 'Eptifibatide', category: 'Parenteral', brandNames: ['Integrilin'] },
  { name: 'Abciximab', category: 'Parenteral', brandNames: ['Reopro'] },
];

export function getAntithromboticGuidance(drugName: string): string | null {
  const drug = ANTITHROMBOTIC_REFERENCE.find(d => d.name === drugName || d.brandNames?.includes(drugName));
  if (!drug) return null;

  let guidance = `CAUTION: Patient on ${drug.category} (${drug.name}). `;
  if (drug.reversalAgent) {
    guidance += `Consider potential requirement for ${drug.reversalAgent} in pre-alert.`;
  }
  return guidance;
}

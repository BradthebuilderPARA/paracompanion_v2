/**
 * Agenda for Change (AfC) Section 2 / Annex 5 Calculator
 *
 * Provides gross estimates for NHS unsocial hours enhancements.
 * Based on NHS Employers Section 2 / Annex 5 guidance (2024 rates):
 *
 *  Band 1-2:  Nights/Sat = 44%,  Sundays/PH = 88%
 *  Band 3:    Nights/Sat = 37%,  Sundays/PH = 74%
 *  Band 4-7:  Nights/Sat = 35%,  Sundays/PH = 60%
 *  Band 8a+:  Not eligible for Section 2 enhancement (fixed pay elements)
 *
 * FIX v1.1.0: Band 4-7 Night/Saturday corrected from 30% → 35%.
 */

export type AfCBand = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8a' | '8b' | '8c' | '8d' | '9';

export interface ShiftPattern {
  startTime: Date;
  endTime: Date;
  isPublicHoliday: boolean;
}

export interface PayEnhancement {
  type: 'Night' | 'Saturday' | 'Sunday' | 'Public Holiday';
  percentage: number;
  hours: number;
  isEstimate: true;
}

export interface AfCCalculationResult {
  enhancements: PayEnhancement[];
  totalEnhancementPercentage: number;
  disclaimer: string;
}

const AFC_DISCLAIMER =
  'DISCLAIMER: This calculator provides GROSS ESTIMATES only based on NHS Employers ' +
  'Section 2 / Annex 5 (2024). Figures do NOT account for Tax, National Insurance, ' +
  'Pension contributions, or local Trust pay variations. Always verify with your Trust ' +
  'payroll department. Band 8a+ staff are assumed to have consolidated unsocial hours ' +
  'and receive 0% enhancement here.';

/**
 * Calculates unsocial hours enhancements for a given shift and band.
 * Implementation based on NHS Employers Section 2 / Annex 5 guidance.
 */
export function calculateAfCEnhancements(band: AfCBand, shift: ShiftPattern): AfCCalculationResult {
  const enhancements: PayEnhancement[] = [];
  
  // Basic Logic for Band 4-7 (Paramedic Core)
  // Nights: 20:00 - 06:00 (Mon-Fri)
  // Saturdays: All Day
  // Sundays: All Day
  // Public Holidays: All Day

  const start = shift.startTime;
  const end = shift.endTime;
  const dayOfWeek = start.getDay(); // 0 = Sunday, 6 = Saturday

  if (shift.isPublicHoliday) {
    enhancements.push({
      type: 'Public Holiday',
      percentage: getPercentage(band, 'SunPH'),
      hours: getDurationInHours(start, end),
      isEstimate: true
    });
  } else if (dayOfWeek === 0) {
    enhancements.push({
      type: 'Sunday',
      percentage: getPercentage(band, 'SunPH'),
      hours: getDurationInHours(start, end),
      isEstimate: true
    });
  } else if (dayOfWeek === 6) {
    enhancements.push({
      type: 'Saturday',
      percentage: getPercentage(band, 'NightSat'),
      hours: getDurationInHours(start, end),
      isEstimate: true
    });
  } else {
    // Weekday - Check for Night (20:00 - 06:00)
    const nightHours = calculateNightHours(start, end);
    if (nightHours > 0) {
      enhancements.push({
        type: 'Night',
        percentage: getPercentage(band, 'NightSat'),
        hours: nightHours,
        isEstimate: true
      });
    }
  }

  return {
    enhancements,
    totalEnhancementPercentage: enhancements.reduce((acc, curr) => acc + curr.percentage, 0),
    disclaimer: AFC_DISCLAIMER
  };
}

function getPercentage(band: AfCBand, type: 'NightSat' | 'SunPH'): number {
  const isHighBand = band.startsWith('8') || band === '9';

  if (type === 'NightSat') {
    if (band === '1' || band === '2') return 44;
    if (band === '3') return 37;
    if (isHighBand) return 0; // Band 8a+ not eligible for Section 2 enhancement
    return 35; // Band 4-7 — CORRECTED from 30% (NHS Employers Annex 5, 2024)
  } else {
    if (band === '1' || band === '2') return 88;
    if (band === '3') return 74;
    if (isHighBand) return 0;
    return 60; // Band 4-7
  }
}

function getDurationInHours(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function calculateNightHours(start: Date, end: Date): number {
  let nightHours = 0;
  const current = new Date(start);
  
  while (current < end) {
    const hour = current.getHours();
    if (hour >= 20 || hour < 6) {
      nightHours += 1;
    }
    current.setHours(current.getHours() + 1);
  }
  
  return nightHours;
}

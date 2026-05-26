import { calculateAfCEnhancements } from './calculator';

describe('AfC Pay Calculator', () => {
  const START_OF_DAY = 7; // 07:00
  const END_OF_DAY = 19;   // 19:00

  test('calculates 100% flat rate for standard day shift (weekday)', () => {
    const shift = {
      startTime: new Date(2024, 0, 15, START_OF_DAY, 0), // Monday Jan 15th
      endTime: new Date(2024, 0, 15, END_OF_DAY, 0),
      isPublicHoliday: false,
    };
    const result = calculateAfCEnhancements('5', shift);
    expect(result.totalEnhancementPercentage).toBe(0);
    expect(result.enhancements.length).toBe(0);
  });

  test('calculates enhancement for night shift (contains unsocial hours)', () => {
    const shift = {
      startTime: new Date(2024, 0, 15, 19, 0), // Monday Night
      endTime: new Date(2024, 0, 16, 7, 0),
      isPublicHoliday: false,
    };
    const result = calculateAfCEnhancements('5', shift);
    expect(result.totalEnhancementPercentage).toBeGreaterThan(0);
    expect(result.enhancements.length).toBeGreaterThan(0);
  });

  test('calculates Saturday enhancement correctly', () => {
    const shift = {
      startTime: new Date(2024, 0, 13, 7, 0), // Saturday Jan 13th
      endTime: new Date(2024, 0, 13, 19, 0),
      isPublicHoliday: false,
    };
    const result = calculateAfCEnhancements('5', shift);
    expect(result.totalEnhancementPercentage).toBeGreaterThan(0);
    expect(result.enhancements.length).toBeGreaterThan(0);
  });

  test('calculates Sunday/Bank Holiday enhancement correctly', () => {
    const shift = {
      startTime: new Date(2024, 0, 14, 7, 0), // Sunday Jan 14th
      endTime: new Date(2024, 0, 14, 19, 0),
      isPublicHoliday: false,
    };
    const result = calculateAfCEnhancements('5', shift);
    // Sunday is usually 60% enhancement for Band 5
    expect(result.totalEnhancementPercentage).toBeGreaterThanOrEqual(60);
    expect(result.enhancements.length).toBeGreaterThan(0);
  });
});

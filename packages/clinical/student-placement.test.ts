import { calculatePlacementProgress, PlacementShift } from './cpd/logic';

jest.mock('@paracompanion/airlock', () => ({
  sanitize: jest.fn(),
}));

describe('Student Placement Logic', () => {
  it('should return 0 for empty shifts', () => {
    const progress = calculatePlacementProgress([], 1500);
    expect(progress.totalLoggedHours).toBe(0);
    expect(progress.totalValidatedHours).toBe(0);
    expect(progress.targetHours).toBe(1500);
    expect(progress.percentageComplete).toBe(0);
  });

  it('should correctly calculate total logged hours but NOT validated hours if signoff is pending', () => {
    const shift: PlacementShift = {
      id: '1',
      userId: 'user1',
      startTime: '2026-03-25T10:00:00Z',
      endTime: '2026-03-25T22:00:00Z', // 12 hours
      siteName: 'LAS Waterloo',
      signoffStatus: 'pending'
    };

    const progress = calculatePlacementProgress([shift], 1500);
    expect(progress.totalLoggedHours).toBe(12);
    expect(progress.totalValidatedHours).toBe(0); // NOT validated
    expect(progress.percentageComplete).toBe(0);
  });

  it('should correctly calculate validated hours when approved', () => {
    const shift1: PlacementShift = {
      id: '1',
      userId: 'user1',
      startTime: '2026-03-25T08:00:00Z',
      endTime: '2026-03-25T20:00:00Z', // 12 hours
      siteName: 'LAS Waterloo',
      signoffStatus: 'approved' // Validated!
    };
    
    const shift2: PlacementShift = {
      id: '2',
      userId: 'user1',
      startTime: '2026-03-26T08:00:00Z',
      endTime: '2026-03-26T18:00:00Z', // 10 hours
      siteName: 'St Thomas',
      signoffStatus: 'pending' // Not Validated
    };

    const progress = calculatePlacementProgress([shift1, shift2], 100);
    expect(progress.totalLoggedHours).toBe(22);
    expect(progress.totalValidatedHours).toBe(12);
    
    // 12 hours out of 100 target is 12%
    expect(progress.percentageComplete).toBe(12);
  });

  it('should cleanly cap percentage at 100% even if hours exceed target', () => {
    const shift: PlacementShift = {
      id: '1',
      userId: 'user1',
      startTime: '2026-03-25T08:00:00Z',
      endTime: '2026-03-25T18:00:00Z', // 10 hours
      siteName: 'LAS Waterloo',
      signoffStatus: 'approved'
    };

    // Target is only 5 hours
    const progress = calculatePlacementProgress([shift], 5);
    expect(progress.totalValidatedHours).toBe(10);
    expect(progress.percentageComplete).toBe(100); // capped at 100
  });
  
  it('should handle decimal hours correctly', () => {
    const shift: PlacementShift = {
      id: '1',
      userId: 'user1',
      startTime: '2026-03-25T08:00:00Z',
      endTime: '2026-03-25T09:30:00Z', // 1.5 hours
      siteName: 'LAS Waterloo',
      signoffStatus: 'approved'
    };

    const progress = calculatePlacementProgress([shift], 100);
    expect(progress.totalValidatedHours).toBe(1.5);
  });
});

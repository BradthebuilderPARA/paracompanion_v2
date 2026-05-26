import { generateHistoryNarrative, searchPresentations } from './logic';
import { HistorySessionState } from './types';

describe('History Helper Logic Engine', () => {
  const mockState: HistorySessionState = {
    presentationKey: 'chest_pain',
    timestamp: '2026-03-26T19:00:00Z',
    isSafetyConfirmed: true,
    redFlags: [
      { id: '1', label: 'Tearing sensation', status: 'positive' },
      { id: '2', label: 'Radiating pain to back', status: 'negative' }
    ],
    questions: [
      { id: 'q1', question: 'Duration?', answer: '30 mins' },
      { id: 'q2', question: 'Severity?', answer: '8/10' }
    ]
  };

  test('generateHistoryNarrative correctly identifies red flags', () => {
    const result = generateHistoryNarrative(mockState);
    expect(result.hasCriticalFlags).toBe(true);
    expect(result.positiveFlags).toContain('Tearing sensation');
    expect(result.narrative).toContain('RED FLAGS IDENTIFIED');
    expect(result.narrative).toContain('Tearing sensation');
  });

  test('generateHistoryNarrative properly builds clinical history string', () => {
    const result = generateHistoryNarrative(mockState);
    expect(result.narrative).toContain('CLINICAL HISTORY');
    expect(result.narrative).toContain('Duration? Result: 30 mins');
    expect(result.narrative).toContain('Severity? Result: 8/10');
  });

  test('generateHistoryNarrative handles zero flags safely', () => {
    const safeState: HistorySessionState = {
      ...mockState,
      redFlags: [
        { id: '1', label: 'Tearing sensation', status: 'negative' }
      ]
    };
    const result = generateHistoryNarrative(safeState);
    expect(result.hasCriticalFlags).toBe(false);
    expect(result.positiveFlags.length).toBe(0);
    expect(result.narrative).toContain('No red flags identified at time of assessment');
  });

  test('searchPresentations filters accurately', () => {
    const data = {
      'chest_pain': {
        key: 'chest_pain',
        label: 'Chest Pain (Non-Traumatic)',
        keywords: ['cardiac', 'acs', 'angina'],
        redFlags: [],
        questions: []
      },
      'asthma': {
        key: 'asthma',
        label: 'Asthma Attack',
        keywords: ['respiratory', 'wheeze'],
        redFlags: [],
        questions: []
      }
    };
    
    expect(searchPresentations('acs', data)).toEqual(['chest_pain']);
    expect(searchPresentations('RESP', data)).toEqual(['asthma']);
    expect(searchPresentations('', data).length).toBe(2);
  });
});

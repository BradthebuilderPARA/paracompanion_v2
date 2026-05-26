import { HistorySessionState, HistoryResult, RedFlagItem, HistoryQuestion } from './types';

/**
 * Generates a professional clinical narrative from the history session state.
 * Offline-safe and follows indicative language guidelines.
 */
export function generateHistoryNarrative(state: HistorySessionState): HistoryResult {
  const positiveFlags = state.redFlags
    .filter(f => f.status === 'positive')
    .map(f => f.label);

  const hasCriticalFlags = positiveFlags.length > 0;
  
  let narrative = '';

  // 1. Red Flag Section
  if (hasCriticalFlags) {
    narrative += `RED FLAGS IDENTIFIED: ${positiveFlags.join('; ')}.\n\n`;
  } else if (state.isSafetyConfirmed) {
    narrative += `No red flags identified at time of assessment (${new Date(state.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).\n\n`;
  }

  // 2. Clinical History Section
  const answeredQuestions = state.questions.filter(q => q.answer && q.answer.trim().length > 0);
  
  if (answeredQuestions.length > 0) {
    narrative += `CLINICAL HISTORY:\n`;
    answeredQuestions.forEach(q => {
      narrative += `- ${q.question} Result: ${q.answer}\n`;
    });
  }

  return {
    narrative: narrative.trim(),
    hasCriticalFlags,
    positiveFlags
  };
}

/**
 * Filters presentations based on search query (label and keywords)
 */
export function searchPresentations(query: string, data: Record<string, any>): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return Object.keys(data);

  return Object.keys(data).filter(key => {
    const p = data[key];
    const matchLabel = p.label.toLowerCase().includes(normalizedQuery);
    const matchKeywords = p.keywords.some((k: string) => k.toLowerCase().includes(normalizedQuery));
    return matchLabel || matchKeywords;
  });
}

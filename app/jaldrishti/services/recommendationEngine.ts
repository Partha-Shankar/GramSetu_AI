import { ParameterResult } from '../types/jaldrishti.types';

export interface Recommendation {
  headline: string;
  detail: string;
  severity: 'safe' | 'warning' | 'unsafe';
}

export function generateRecommendation(results: ParameterResult[]): Recommendation {
  const hasUnsafe = results.some((r) => r.status === 'unsafe');
  const hasWarning = results.some((r) => r.status === 'warning');

  if (hasUnsafe) {
    return {
      severity: 'unsafe',
      headline: 'Avoid drinking this water untreated.',
      detail:
        'One or more parameters are outside safe limits. Boil the water thoroughly before any use, and consider laboratory testing to confirm before regular use.',
    };
  }

  if (hasWarning) {
    return {
      severity: 'warning',
      headline: 'Boiling is recommended before drinking.',
      detail:
        'Some parameters are borderline. Boiling should help, but consider laboratory testing for confirmation before long-term regular use.',
    };
  }

  return {
    severity: 'safe',
    headline: 'Water appears safe for regular use.',
    detail:
      'All tested parameters are within safe range. Consider laboratory testing periodically to confirm, especially if the water source changes.',
  };
}
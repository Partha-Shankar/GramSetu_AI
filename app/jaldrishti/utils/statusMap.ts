import { ParameterResult } from '../types/jaldrishti.types';

export type BadgeStatus = 'success' | 'warning' | 'error';

export function toBadgeStatus(status: ParameterResult['status']): BadgeStatus {
  if (status === 'safe') return 'success';
  if (status === 'warning') return 'warning';
  return 'error';
}

export function toBadgeLabel(status: ParameterResult['status']): string {
  if (status === 'safe') return 'Safe';
  if (status === 'warning') return 'Warning';
  return 'Unsafe';
}
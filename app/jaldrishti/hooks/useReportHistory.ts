'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ParameterResult, SavedReport } from '../types/jaldrishti.types';

const STORAGE_KEY = 'jaldrishti_reports';

function computeOverallStatus(results: ParameterResult[]): SavedReport['overallStatus'] {
  if (results.some((r) => r.status === 'unsafe')) return 'unsafe';
  if (results.some((r) => r.status === 'warning')) return 'warning';
  return 'safe';
}

export function useReportHistory() {
  const [reports, setReports] = useLocalStorage<SavedReport[]>(STORAGE_KEY, []);

  const saveReport = (results: ParameterResult[]) => {
    const newReport: SavedReport = {
      id: `${Date.now()}`,
      timestamp: Date.now(),
      results,
      overallStatus: computeOverallStatus(results),
    };
    setReports((prev) => [newReport, ...prev].slice(0, 20)); // keep last 20 only
  };

  return { reports, saveReport };
}
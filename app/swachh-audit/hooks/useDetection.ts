'use client';

import { useAudit } from '../context/AuditContext';

export function useDetection() {
  const {
    isProcessing,
    progress,
    logs,
    currentReport,
    isModelLoading,
    error,
    startDetection,
    reset,
    setError,
  } = useAudit();

  return {
    isProcessing,
    progress,
    logs,
    currentReport,
    isModelLoading,
    error,
    runDetection: startDetection,
    reset,
    setError,
  };
}

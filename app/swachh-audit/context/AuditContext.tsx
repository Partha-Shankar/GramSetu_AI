'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { SwachhAuditReport } from '../types/types';
import { detector } from '../services/detection/detector';
import { auditService } from '../services/auditService';

export interface AuditContextType {
  capturedImage: string | null;
  isProcessing: boolean;
  progress: number;
  logs: string[];
  currentReport: SwachhAuditReport | null;
  isModelLoading: boolean;
  error: string | null;
  setCapturedImage: (image: string | null) => void;
  reset: () => void;
  setError: (err: string | null) => void;
  startDetection: (villageName: string) => Promise<SwachhAuditReport | null>;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [capturedImage, setCapturedImageState] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentReport, setCurrentReport] = useState<SwachhAuditReport | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCapturedImage = useCallback((image: string | null) => {
    // Also store in localStorage for fallback/persistence across reload if needed
    if (image) {
      try {
        localStorage.setItem('swachh_audit_temp_image', image);
      } catch (e) {
        console.warn('LocalStorage quota exceeded for temp image:', e);
      }
    } else {
      localStorage.removeItem('swachh_audit_temp_image');
    }
    setCapturedImageState(image);
  }, []);

  const reset = useCallback(() => {
    setCapturedImageState(null);
    setIsProcessing(false);
    setProgress(0);
    setLogs([]);
    setCurrentReport(null);
    setIsModelLoading(false);
    setError(null);
    localStorage.removeItem('swachh_audit_temp_image');
  }, []);

  const startDetection = useCallback(async (villageName: string): Promise<SwachhAuditReport | null> => {
    const img = capturedImage || localStorage.getItem('swachh_audit_temp_image');
    if (!img) {
      const errMessage = 'No image available for detection.';
      setError(errMessage);
      return null;
    }

    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setError(null);

    try {
      // Run the detection pipeline
      const report = await detector.runDetection(
        img,
        villageName,
        (p, log) => {
          setProgress(p);
          if (log) {
            setLogs((prev) => [...prev, log]);
          }
        }
      );

      // Save report in history using auditService
      auditService.saveReport(report);
      setCurrentReport(report);
      setIsProcessing(false);
      setProgress(100);
      
      // Clean up temp image now that report is generated
      localStorage.removeItem('swachh_audit_temp_image');
      
      return report;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'AI Detection Pipeline failed.';
      console.error('Detection error:', err);
      setError(errMsg);
      setIsProcessing(false);
      return null;
    }
  }, [capturedImage]);

  return (
    <AuditContext.Provider
      value={{
        capturedImage,
        isProcessing,
        progress,
        logs,
        currentReport,
        isModelLoading,
        error,
        setCapturedImage,
        reset,
        setError,
        startDetection,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}

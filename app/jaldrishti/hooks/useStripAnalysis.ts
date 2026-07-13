'use client';

import { useState, useCallback } from 'react';
import { processStripImage } from '../services/imageProcessor';
import { analyzeWaterQuality } from '../services/waterAnalysisService';
import { CapturedImage, ParameterResult } from '../types/jaldrishti.types';

interface UseStripAnalysisReturn {
  results: ParameterResult[] | null;
  isAnalyzing: boolean;
  error: string | null;
  runAnalysis: (image: CapturedImage) => Promise<void>;
  reset: () => void;
}

export function useStripAnalysis(): UseStripAnalysisReturn {
  const [results, setResults] = useState<ParameterResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (image: CapturedImage) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const pads = await processStripImage(image);
      const parameterResults = analyzeWaterQuality(pads);
      setResults(parameterResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not analyze the strip image.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, isAnalyzing, error, runAnalysis, reset };
}
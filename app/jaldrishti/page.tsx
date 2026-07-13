'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { CameraView } from './components/CameraView';
import { ImagePreview } from './components/ImagePreview';
import { WaterReportCard } from './components/WaterReportCard';
import { SafetySummaryBanner } from './components/SafetySummaryBanner';
import { useStripAnalysis } from './hooks/useStripAnalysis';
import { CapturedImage, ScanStage } from './types/jaldrishti.types';

export default function JalDrishtiPage() {
  const [stage, setStage] = useState<ScanStage>('camera');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const { results, isAnalyzing, error, runAnalysis, reset } = useStripAnalysis();

  const handleCapture = (image: CapturedImage) => {
    setCapturedImage(image);
    setStage('preview');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    reset();
    setStage('camera');
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setStage('analyzing');
    await runAnalysis(capturedImage);
    setStage('results');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="JalDrishti"
        description="Scan a water testing strip for a quick safety check."
      />

      {stage === 'camera' && <CameraView onCapture={handleCapture} />}

      {stage === 'preview' && capturedImage && (
        <ImagePreview image={capturedImage} onRetake={handleRetake} onAnalyze={handleAnalyze} />
      )}

      {stage === 'analyzing' && (
        <div className="space-y-3 py-8">
          <LoadingSkeleton count={5} className="h-8" />
        </div>
      )}

      {stage === 'results' && error && (
        <ErrorState title="Analysis failed" message={error} onRetry={handleRetake} />
      )}

      {stage === 'results' && results && (
        <div className="space-y-4">
          <SafetySummaryBanner results={results} />
          <div className="space-y-3">
            {results.map((result) => (
              <WaterReportCard key={result.parameter} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
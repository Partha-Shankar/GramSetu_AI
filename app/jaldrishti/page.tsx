'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, History, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { CameraView } from './components/CameraView';
import { ImagePreview } from './components/ImagePreview';
import { WaterReportCard } from './components/WaterReportCard';
import { SafetySummaryBanner } from './components/SafetySummaryBanner';
import { RecommendationCard } from './components/RecommendationCard';
import { ReportHistoryList } from './components/ReportHistoryList';
import { useStripAnalysis } from './hooks/useStripAnalysis';
import { useReportHistory } from './hooks/useReportHistory';
import { generateRecommendation } from './services/recommendationEngine';
import { CapturedImage, ScanStage, SavedReport } from './types/jaldrishti.types';

export default function JalDrishtiPage() {
  const [stage, setStage] = useState<ScanStage>('camera');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const { results, isAnalyzing, error, runAnalysis, reset } = useStripAnalysis();
  const { reports, saveReport } = useReportHistory();

  useEffect(() => {
    if (results) saveReport(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

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

  const handleToggleHistory = () => {
    setSelectedReport(null);
    setShowHistory((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="JalDrishti"
          description="Scan a water testing strip for a quick safety check."
        />
        <Button variant="outline" size="sm" onClick={handleToggleHistory}>
          <History className="w-4 h-4 mr-2" />
          {showHistory ? 'Back to Scanner' : 'View Past Reports'}
        </Button>
      </div>

      {showHistory && !selectedReport && (
        <ReportHistoryList reports={reports} onSelectReport={setSelectedReport} />
      )}

      {showHistory && selectedReport && (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
          <SafetySummaryBanner results={selectedReport.results} />
          <div className="space-y-3">
            {selectedReport.results.map((result) => (
              <WaterReportCard key={result.parameter} result={result} />
            ))}
          </div>
          <RecommendationCard recommendation={generateRecommendation(selectedReport.results)} />
        </div>
      )}

      {!showHistory && (
        <>
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
              <RecommendationCard recommendation={generateRecommendation(results)} />
              <Button variant="outline" className="w-full" onClick={handleRetake}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
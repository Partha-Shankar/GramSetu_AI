'use client';
import { processStripImage } from './services/imageProcessor';
import React, { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { CameraView } from './components/CameraView';
import { ImagePreview } from './components/ImagePreview';
import { CapturedImage, ScanStage } from './types/jaldrishti.types';

export default function JalDrishtiPage() {
  const [stage, setStage] = useState<ScanStage>('camera');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);

  const handleCapture = (image: CapturedImage) => {
    setCapturedImage(image);
    setStage('preview');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStage('camera');
  };

  const handleAnalyze = async () => {
  if (!capturedImage) return;
  setStage('analyzing');

  // Temporary sanity check for Day 2 — Day 3 replaces this with real
  // parameter matching + the results screen.
  const pads = await processStripImage(capturedImage);
  console.log('Extracted pad colors:', pads);
};

  return (
    <div className="space-y-6">
      <PageHeader title="JalDrishti" description="Scan a water testing strip for a quick safety check." />

      {stage === 'camera' && <CameraView onCapture={handleCapture} />}
      {stage === 'preview' && capturedImage && (
        <ImagePreview image={capturedImage} onRetake={handleRetake} onAnalyze={handleAnalyze} />
      )}
      {stage === 'analyzing' && (
        <div className="text-sm text-neutral-400 text-center py-12">
          Analysis pipeline coming in Day 3.
        </div>
      )}
    </div>
  );
}
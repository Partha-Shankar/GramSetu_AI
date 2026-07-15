'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { DocumentUploadCard } from './components/document-upload-card';
import { DocumentPreviewCard } from './components/document-preview-card';
import { OcrPreviewCard } from './components/ocr-preview-card';
import { useDocumentOcr } from './hooks/useDocumentOcr';

export default function GramLipiPage() {
  const {
    state,
    ocrProgress,
    cropTopPercent,
    setCropTopPercent,
    cropBottomPercent,
    setCropBottomPercent,
    selectDocument,
    confirmScan,
    updateEditedText,
    summaryState,
    runSummarize,
    simplifyState,
    runSimplify,
    language,
    setLanguage,
    reset,
  } = useDocumentOcr();

  const isProcessing = state.stage === 'uploading' || state.stage === 'ocr';
  const showUploadCard = state.stage === 'idle' || state.stage === 'error';

  return (
    <div className="space-y-6">
      <PageHeader
        title="GramLipi"
        description="OCR scanning and regional language translation."
      />

      {showUploadCard && (
        <DocumentUploadCard onFileSelected={selectDocument} disabled={isProcessing} />
      )}

      {state.stage === 'preview' && state.document && (
        <DocumentPreviewCard
          imageDataUrl={state.document.imageDataUrl}
          cropTopPercent={cropTopPercent}
          cropBottomPercent={cropBottomPercent}
          onCropTopChange={setCropTopPercent}
          onCropBottomChange={setCropBottomPercent}
          onConfirm={confirmScan}
          onChangeDocument={reset}
        />
      )}

      <OcrPreviewCard
        state={state}
        ocrProgress={ocrProgress}
        onEditedTextChange={updateEditedText}
        onRetry={reset}
        summaryState={summaryState}
        onSummarize={runSummarize}
        simplifyState={simplifyState}
        onSimplify={runSimplify}
        language={language}
        onLanguageChange={setLanguage}
      />
    </div>
  );
}
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import type { DocumentSummary, GramLipiState } from '../types';

interface SummaryState {
  status: 'idle' | 'loading' | 'done' | 'error';
  summary: DocumentSummary | null;
  error: string | null;
}

interface OcrPreviewCardProps {
  state: GramLipiState;
  ocrProgress: number;
  onEditedTextChange: (text: string) => void;
  onRetry: () => void;
  summaryState: SummaryState;
  onSummarize: () => void;
}

export function OcrPreviewCard({
  state,
  ocrProgress,
  onEditedTextChange,
  onRetry,
  summaryState,
  onSummarize,
}: OcrPreviewCardProps) {
  const { stage, ocrResult, error, document } = state;

  if (stage === 'idle' || stage === 'preview') {
    return null;
  }

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Extracted Text</CardTitle>
        <CardDescription className="text-xs">
          Review the text read from your document and fix any OCR mistakes before
          continuing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(stage === 'uploading' || stage === 'ocr') && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-500">
              {stage === 'uploading' ? 'Preparing document…' : `Reading text… ${ocrProgress}%`}
            </p>
            <LoadingSkeleton count={4} />
          </div>
        )}

        {stage === 'error' && (
          <ErrorState
            title="Couldn't read this document"
            message={error ?? 'Something went wrong while processing the document.'}
            onRetry={onRetry}
          />
        )}

        {stage === 'done' && ocrResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{document?.fileName}</span>
              <span>OCR confidence: {ocrResult.confidence}%</span>
            </div>
            <textarea
              value={ocrResult.editedText}
              onChange={(event) => onEditedTextChange(event.target.value)}
              rows={10}
              className="w-full rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Extracted text will appear here…"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-neutral-500">
                Summarize using a local LLM via Ollama (dev-only — see note in
                llmService.ts).
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onSummarize}
                disabled={summaryState.status === 'loading'}
              >
                {summaryState.status === 'loading' ? 'Summarizing…' : 'Summarize'}
              </Button>
            </div>

            {summaryState.status === 'error' && (
              <ErrorState
                title="Couldn't summarize this document"
                message={
                  summaryState.error ?? 'Something went wrong while contacting the local model.'
                }
                onRetry={onSummarize}
              />
            )}

            {summaryState.status === 'done' && summaryState.summary && (
              <div className="space-y-3 rounded-md border border-neutral-200 bg-neutral-50/50 p-4 text-sm">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-700">Main Purpose</h4>
                  <p className="text-neutral-700">{summaryState.summary.mainPurpose}</p>
                </div>

                {summaryState.summary.importantDates.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-700">Important Dates</h4>
                    <ul className="list-inside list-disc text-neutral-700">
                      {summaryState.summary.importantDates.map((date) => (
                        <li key={date}>{date}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summaryState.summary.requiredActions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-700">Required Actions</h4>
                    <ul className="list-inside list-disc text-neutral-700">
                      {summaryState.summary.requiredActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {summaryState.summary.keyPoints.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-700">Key Points</h4>
                    <ul className="list-inside list-disc text-neutral-700">
                      {summaryState.summary.keyPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
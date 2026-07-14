'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { exportNodeToPdf } from '../utils/exportLetterPdf';
import type { ComplaintLetter, Language } from '../types';

interface ComplaintLetterCardProps {
  status: 'idle' | 'loading' | 'done' | 'error';
  letter: ComplaintLetter | null;
  error: string | null;
  onRetry: () => void;
}

const LABELS: Record<Language, { downloadPdf: string; generatingPdf: string; pdfError: string }> = {
  en: {
    downloadPdf: 'Download PDF',
    generatingPdf: 'Preparing PDF…',
    pdfError: 'Could not generate the PDF. Please try again.',
  },
  kn: {
    downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    generatingPdf: 'PDF ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…',
    pdfError: 'PDF ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  },
};

function letterToPlainText(letter: ComplaintLetter): string {
  return [letter.subject, '', letter.greeting, '', letter.body, '', letter.closingStatement].join('\n');
}

function letterFileName(letter: ComplaintLetter): string {
  const safeTitle = letter.details.issueTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
  return `complaint-letter-${safeTitle || letter.id}.pdf`;
}

export function ComplaintLetterCard({ status, letter, error, onRetry }: ComplaintLetterCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  if (status === 'idle') return null;

  const t = letter ? LABELS[letter.language] : LABELS.en;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Not worth a full error state — just skip the "Copied!" feedback.
    }
  };

  const handleDownloadPdf = async () => {
    if (!letter || !printableRef.current) return;
    setPdfError(null);
    setIsExportingPdf(true);
    try {
      await exportNodeToPdf(printableRef.current, letterFileName(letter));
    } catch {
      setPdfError(t.pdfError);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Complaint Letter</CardTitle>
        <CardDescription className="text-xs">
          Review the drafted letter below, then download it as a PDF to submit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' && <p className="text-xs text-neutral-500">Drafting your letter…</p>}

        {status === 'error' && (
          <ErrorState
            title="Couldn't generate the letter"
            message={error ?? 'Something went wrong while contacting the local model.'}
            onRetry={onRetry}
          />
        )}

        {status === 'done' && letter && (
          <div className="space-y-3 rounded-md border border-neutral-200 bg-neutral-50/50 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-neutral-700">Subject: {letter.subject}</h4>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(letterToPlainText(letter))}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isExportingPdf}>
                  {isExportingPdf ? t.generatingPdf : t.downloadPdf}
                </Button>
              </div>
            </div>
            <p className="text-neutral-700">{letter.greeting}</p>
            <p className="whitespace-pre-wrap text-neutral-700">{letter.body}</p>
            <p className="text-neutral-700">{letter.closingStatement}</p>

            {pdfError && <p className="text-xs text-red-600">{pdfError}</p>}
          </div>
        )}

        {/* Off-screen printable version — plain white/black, independent of the
            app's dark theme, captured by html2canvas for the PDF. Kept in the
            DOM (not display:none) so html2canvas can actually render it. */}
        {letter && (
          <div style={{ position: 'fixed', top: 0, left: '-9999px', width: '595px' }}>
            <div
              ref={printableRef}
              style={{
                width: '595px',
                padding: '40px',
                backgroundColor: '#ffffff',
                color: '#111111',
                fontFamily: 'sans-serif',
                fontSize: '13px',
                lineHeight: 1.6,
              }}
            >
              <p style={{ marginBottom: '24px' }}>{letter.details.date}</p>
              <p style={{ marginBottom: '4px', fontWeight: 600 }}>To,</p>
              <p style={{ marginBottom: '4px' }}>{letter.details.authorityName}</p>
              <p style={{ marginBottom: '24px' }}>{letter.details.location}</p>

              <p style={{ marginBottom: '16px', fontWeight: 600 }}>Subject: {letter.subject}</p>

              <p style={{ marginBottom: '16px' }}>{letter.greeting}</p>
              <p style={{ marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{letter.body}</p>
              <p style={{ marginBottom: '32px' }}>{letter.closingStatement}</p>

              <p>Yours sincerely,</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
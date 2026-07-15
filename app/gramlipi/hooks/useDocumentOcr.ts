'use client';

import { useCallback, useState } from 'react';
import { generateId } from '@/utils/generateId';
import { fileToDataUrl, preprocessImage, runOCR, validateDocumentFile } from '../services/ocrService';
import { summarizeDocument } from '../services/llmService';
import type {
  DocumentSourceType,
  DocumentSummary,
  GramLipiState,
  OCRResult,
  UploadedDocument,
} from '../types';

interface SummaryState {
  status: 'idle' | 'loading' | 'done' | 'error';
  summary: DocumentSummary | null;
  error: string | null;
}

const initialSummaryState: SummaryState = {
  status: 'idle',
  summary: null,
  error: null,
};

const initialState: GramLipiState = {
  document: null,
  ocrResult: null,
  simplifiedDocument: null,
  summary: null,
  stage: 'idle',
  error: null,
};

export function useDocumentOcr() {
  const [state, setState] = useState<GramLipiState>(initialState);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [cropTopPercent, setCropTopPercent] = useState(0);
  const [cropBottomPercent, setCropBottomPercent] = useState(0);
  // Kept separate from `state.stage`: a summarization failure should never
  // hide the already-successful OCR text/editor behind an error screen.
  const [summaryState, setSummaryState] = useState<SummaryState>(initialSummaryState);
  // Kept outside GramLipiState: it's an ephemeral File reference needed to
  // (re-)run OCR after the user adjusts the crop, not shared app state.
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const reset = useCallback(() => {
    setState(initialState);
    setOcrProgress(0);
    setCropTopPercent(0);
    setCropBottomPercent(0);
    setPendingFile(null);
    setSummaryState(initialSummaryState);
  }, []);

  /** Step 1: user uploads/captures an image — show a preview before scanning. */
  const selectDocument = useCallback(
    async (file: File, sourceType: DocumentSourceType) => {
      const validationError = validateDocumentFile(file);
      if (validationError) {
        setState((prev) => ({ ...prev, stage: 'error', error: validationError }));
        return;
      }

      setState((prev) => ({ ...prev, stage: 'uploading', error: null }));
      setCropTopPercent(0);
      setCropBottomPercent(0);

      try {
        const imageDataUrl = await fileToDataUrl(file);

        const document: UploadedDocument = {
          id: generateId('doc'),
          fileName: file.name || 'camera-capture.jpg',
          sourceType,
          imageDataUrl,
          uploadedAt: new Date().toISOString(),
        };

        setPendingFile(file);
        setState((prev) => ({ ...prev, document, stage: 'preview' }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          stage: 'error',
          error: err instanceof Error ? err.message : 'Could not read the selected file.',
        }));
      }
    },
    []
  );

  /** Step 2: user confirms the crop (if any) and runs OCR. */
  const confirmScan = useCallback(async () => {
    if (!pendingFile) return;

    setState((prev) => ({ ...prev, stage: 'ocr', error: null }));
    setOcrProgress(0);

    try {
      const preprocessedCanvas = await preprocessImage(pendingFile, {
        cropTopPercent,
        cropBottomPercent,
      });
      const { rawText, confidence } = await runOCR(preprocessedCanvas, setOcrProgress);

      setState((prev) => {
        if (!prev.document) return prev;
        const ocrResult: OCRResult = {
          documentId: prev.document.id,
          rawText,
          editedText: rawText,
          confidence,
          processedAt: new Date().toISOString(),
        };
        return { ...prev, ocrResult, stage: 'done' };
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        stage: 'error',
        error:
          err instanceof Error
            ? err.message
            : 'Something went wrong while reading the document.',
      }));
    }
  }, [pendingFile, cropTopPercent, cropBottomPercent]);

  const updateEditedText = useCallback((text: string) => {
    setState((prev) =>
      prev.ocrResult ? { ...prev, ocrResult: { ...prev.ocrResult, editedText: text } } : prev
    );
    // Editing the text invalidates any summary generated from the old text.
    setSummaryState(initialSummaryState);
  }, []);

  /** Sends the (possibly user-corrected) OCR text to the local LLM for summarization. */
  const runSummarize = useCallback(async () => {
    if (!state.ocrResult || !state.document) return;

    setSummaryState({ status: 'loading', summary: null, error: null });

    try {
      const summary = await summarizeDocument(state.ocrResult.editedText, state.document.id);
      setSummaryState({ status: 'done', summary, error: null });
      setState((prev) => ({ ...prev, summary }));
    } catch (err) {
      setSummaryState({
        status: 'error',
        summary: null,
        error:
          err instanceof Error ? err.message : 'Could not summarize this document.',
      });
    }
  }, [state.ocrResult, state.document]);

  return {
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
    reset,
  };
}
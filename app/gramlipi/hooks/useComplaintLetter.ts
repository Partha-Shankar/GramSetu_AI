'use client';

import { useCallback, useState } from 'react';
import { generateId } from '@/utils/generateId';
import { generateComplaintLetter } from '../services/llmService';
import type { ComplaintDetails, ComplaintLetter, Language } from '../types';

interface ComplaintLetterState {
  status: 'idle' | 'loading' | 'done' | 'error';
  letter: ComplaintLetter | null;
  error: string | null;
}

const initialComplaintDetails: ComplaintDetails = {
  issueTitle: '',
  location: '',
  description: '',
  date: '',
  authorityName: '',
};

const initialLetterState: ComplaintLetterState = {
  status: 'idle',
  letter: null,
  error: null,
};

export function useComplaintLetter() {
  const [details, setDetails] = useState<ComplaintDetails>(initialComplaintDetails);
  const [letterState, setLetterState] = useState<ComplaintLetterState>(initialLetterState);
  // Own language state — deliberately independent of useDocumentOcr's language,
  // since filing a complaint doesn't require having scanned a document first.
  const [language, setLanguageRaw] = useState<Language>('en');

  const updateField = useCallback((field: keyof ComplaintDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    // Editing the form after a letter exists invalidates it.
    setLetterState(initialLetterState);
  }, []);

  /** Switching language invalidates any letter generated in the old language. */
  const setLanguage = useCallback((lang: Language) => {
    setLanguageRaw(lang);
    setLetterState(initialLetterState);
  }, []);

  const isDetailsComplete =
    details.issueTitle.trim() !== '' &&
    details.location.trim() !== '' &&
    details.description.trim() !== '' &&
    details.date.trim() !== '' &&
    details.authorityName.trim() !== '';

  const runGenerateLetter = useCallback(async () => {
    if (!isDetailsComplete) return;

    setLetterState({ status: 'loading', letter: null, error: null });

    try {
      const letter = await generateComplaintLetter(details, generateId('letter'), language);
      setLetterState({ status: 'done', letter, error: null });
    } catch (err) {
      setLetterState({
        status: 'error',
        letter: null,
        error: err instanceof Error ? err.message : 'Could not generate the complaint letter.',
      });
    }
  }, [details, language, isDetailsComplete]);

  const resetComplaint = useCallback(() => {
    setDetails(initialComplaintDetails);
    setLetterState(initialLetterState);
  }, []);

  return {
    details,
    updateField,
    isDetailsComplete,
    letterState,
    runGenerateLetter,
    resetComplaint,
    language,
    setLanguage,
  };
}
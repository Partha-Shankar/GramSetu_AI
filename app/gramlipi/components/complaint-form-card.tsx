'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ComplaintDetails ,Language} from '../types';

interface ComplaintFormCardProps {
  details: ComplaintDetails;
  onFieldChange: (field: keyof ComplaintDetails, value: string) => void;
  isDetailsComplete: boolean;
  onGenerate: () => void;
  onClear: () => void;
  isGenerating: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const inputClassName =
  'w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100';

const FIELDS: { key: keyof ComplaintDetails; label: string; placeholder: string; type?: string }[] = [
  { key: 'issueTitle', label: 'Issue Title', placeholder: 'e.g. No streetlights on Main Road' },
  { key: 'location', label: 'Location', placeholder: 'e.g. Ward 4, near the water tank' },
  { key: 'date', label: 'Date', placeholder: '', type: 'date' },
  { key: 'authorityName', label: 'Authority', placeholder: 'e.g. Gram Panchayat Office' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

export function ComplaintFormCard({
  details,
  onFieldChange,
  isDetailsComplete,
  onGenerate,
  onClear,
  isGenerating,
  language,
  onLanguageChange,
}: ComplaintFormCardProps) {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold">File a Complaint</CardTitle>
        <CardDescription className="text-xs">
          Fill in the details below and we&apos;ll draft a formal complaint letter for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <label htmlFor={`complaint-${field.key}`} className="text-xs text-neutral-500">
                {field.label}
              </label>
              <input
                id={`complaint-${field.key}`}
                type={field.type ?? 'text'}
                value={details[field.key]}
                onChange={(event) => onFieldChange(field.key, event.target.value)}
                placeholder={field.placeholder}
                className={inputClassName}
              />
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor="complaint-description" className="text-xs text-neutral-500">
            Description
          </label>
          <textarea
            id="complaint-description"
            value={details.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            rows={4}
            placeholder="Describe the issue in your own words…"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="complaint-language" className="text-xs text-neutral-500">
              Letter language
            </label>
            <select
              id="complaint-language"
              value={language}
              onChange={(event) => onLanguageChange(event.target.value as Language)}
              className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerate}
              disabled={!isDetailsComplete || isGenerating}
            >
              {isGenerating ? 'Drafting letter…' : 'Generate Complaint Letter'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
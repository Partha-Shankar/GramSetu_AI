'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentPreviewCardProps {
  imageDataUrl: string;
  cropTopPercent: number;
  cropBottomPercent: number;
  onCropTopChange: (percent: number) => void;
  onCropBottomChange: (percent: number) => void;
  onConfirm: () => void;
  onChangeDocument: () => void;
}

export function DocumentPreviewCard({
  imageDataUrl,
  cropTopPercent,
  cropBottomPercent,
  onCropTopChange,
  onCropBottomChange,
  onConfirm,
  onChangeDocument,
}: DocumentPreviewCardProps) {
  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Adjust &amp; Scan</CardTitle>
        <CardDescription className="text-xs">
          Exclude any letterhead/seal at the top and any signature/stamp at the bottom —
          this usually improves accuracy a lot, since Tesseract will otherwise try to read
          those graphics as text.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-md border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageDataUrl} alt="Uploaded document preview" className="w-full" />
          {cropTopPercent > 0 && (
            <div
              className="absolute inset-x-0 top-0 border-b-2 border-dashed border-red-500 bg-black/50"
              style={{ height: `${cropTopPercent}%` }}
            />
          )}
          {cropBottomPercent > 0 && (
            <div
              className="absolute inset-x-0 bottom-0 border-t-2 border-dashed border-red-500 bg-black/50"
              style={{ height: `${cropBottomPercent}%` }}
            />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <label htmlFor="crop-top-slider">Exclude header / logo area</label>
            <span>{cropTopPercent}%</span>
          </div>
          <input
            id="crop-top-slider"
            type="range"
            min={0}
            max={40}
            step={1}
            value={cropTopPercent}
            onChange={(event) => onCropTopChange(Number(event.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <label htmlFor="crop-bottom-slider">Exclude signature / footer area</label>
            <span>{cropBottomPercent}%</span>
          </div>
          <input
            id="crop-bottom-slider"
            type="range"
            min={0}
            max={40}
            step={1}
            value={cropBottomPercent}
            onChange={(event) => onCropBottomChange(Number(event.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onChangeDocument}>
            Choose Different Image
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Scan Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
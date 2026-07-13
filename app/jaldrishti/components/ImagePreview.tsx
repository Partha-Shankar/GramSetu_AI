import React from 'react';
import { RotateCcw, ScanSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CapturedImage } from '../types/jaldrishti.types';

interface ImagePreviewProps {
  image: CapturedImage;
  onRetake: () => void;
  onAnalyze: () => void;
}

export function ImagePreview({ image, onRetake, onAnalyze }: ImagePreviewProps) {
  return (
    <Card className="border-neutral-200">
      <CardContent className="p-4 space-y-4">
        <div className="w-full rounded-md overflow-hidden border border-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.dataUrl} alt="Captured water testing strip" className="w-full h-auto object-contain" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onRetake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button variant="primary" className="flex-1" onClick={onAnalyze}>
            <ScanSearch className="w-4 h-4 mr-2" />
            Analyze Strip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
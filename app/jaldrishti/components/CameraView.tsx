'use client';

import React, { useEffect, useRef } from 'react';
import { Camera, Upload, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCamera } from '../hooks/useCamera';
import { StripOverlay } from './StripOverlay';
import { CapturedImage } from '../types/jaldrishti.types';

interface CameraViewProps {
  onCapture: (image: CapturedImage) => void;
}

export function CameraView({ onCapture }: CameraViewProps) {
  const { videoRef, isStreaming, error, startCamera, stopCamera, capture } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const image = capture();
    if (image) onCapture(image);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        onCapture({ dataUrl: reader.result as string, width: img.width, height: img.height });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-neutral-200">
      <CardContent className="p-4 space-y-4">
        <div className="relative w-full aspect-video bg-neutral-900 rounded-md overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {isStreaming && <StripOverlay />}
          {!isStreaming && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
              Starting camera...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
              <ScanLine className="w-6 h-6 text-neutral-400" />
              <p className="text-sm text-neutral-300">{error}</p>
              <p className="text-xs text-neutral-500">You can still upload a photo of the strip instead.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="primary" className="flex-1" onClick={handleCapture} disabled={!isStreaming}>
            <Camera className="w-4 h-4 mr-2" />
            Capture Strip
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      </CardContent>
    </Card>
  );
}
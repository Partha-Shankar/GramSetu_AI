'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { CameraCaptureModal } from './camera-capture-modal';
import type { DocumentSourceType } from '../types';

interface DocumentUploadCardProps {
  onFileSelected: (file: File, sourceType: DocumentSourceType) => void;
  disabled?: boolean;
  className?: string;
}

// Some older/embedded browsers don't support getUserMedia. In that case we
// fall back to the OS file-picker's camera capture attribute instead of
// showing a broken live-camera modal.
function supportsLiveCamera() {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function'
  );
}

export function DocumentUploadCard({ onFileSelected, disabled, className }: DocumentUploadCardProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const fallbackCameraInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  function handleChange(sourceType: DocumentSourceType) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelected(file, sourceType);
      }
      // Allow re-selecting the same file again later.
      event.target.value = '';
    };
  }

  function handleUseCameraClick() {
    if (supportsLiveCamera()) {
      setIsCameraOpen(true);
    } else {
      fallbackCameraInputRef.current?.click();
    }
  }

  function handleCameraCapture(file: File) {
    setIsCameraOpen(false);
    onFileSelected(file, 'camera');
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file, 'upload');
    }
  }

  return (
    <Card className={cn('border-neutral-200', className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Upload a Document</CardTitle>
        <CardDescription className="text-xs">
          Upload a government notice or take a photo. Processing happens entirely on
          your device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-4 h-56 border border-dashed border-neutral-200 rounded-md bg-neutral-50/50 px-6 text-center"
        >
          <Upload className="w-8 h-8 text-neutral-400" />
          <p className="text-sm text-neutral-500">
            Drag and drop an image here, or choose an option below
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              disabled={disabled}
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={handleUseCameraClick}
            >
              <Camera className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
          </div>
        </div>

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleChange('upload')}
        />
        {/* Fallback for browsers without getUserMedia support */}
        <input
          ref={fallbackCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleChange('camera')}
        />
      </CardContent>

      {isCameraOpen && (
        <CameraCaptureModal
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </Card>
  );
}
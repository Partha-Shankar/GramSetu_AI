'use client';

import React, { useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useImageUpload } from '../hooks/useImageUpload';

interface UploadCardProps {
  onContinue: (imageSrc: string) => void;
}

export function UploadCard({ onContinue }: UploadCardProps) {
  const {
    imageSrc,
    dragActive,
    error,
    handleDrag,
    handleDrop,
    handleFileChange,
    handlePaste,
    removeImage,
  } = useImageUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attach global paste listener so Ctrl+V anywhere on the upload component/page works
  useEffect(() => {
    const windowPasteHandler = (e: ClipboardEvent) => {
      handlePaste(e);
    };
    window.addEventListener('paste', windowPasteHandler);
    return () => {
      window.removeEventListener('paste', windowPasteHandler);
    };
  }, [handlePaste]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (imageSrc) {
      onContinue(imageSrc);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-md">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 p-4">
        <CardTitle className="text-sm font-semibold flex items-center space-x-1.5">
          <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Upload Image</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Select, drop, or paste (Ctrl+V) a photo of a waste pile, stagnant water, or sewer
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {error && (
          <div className="mb-4 flex items-start space-x-2 text-xs bg-red-50 text-red-700 p-3 rounded-md border border-red-100 dark:bg-red-950/20 dark:text-red-405 dark:border-red-900/35">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!imageSrc ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`w-full min-h-[260px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/15'
                : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
            </div>

            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Drag & drop file here, paste image, or <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
              Supports JPEG, PNG, WEBP up to 10MB
            </p>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 aspect-video flex items-center justify-center max-h-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Preview" className="w-full h-full object-contain" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full p-1.5 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 p-4 flex items-center justify-between">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center">
          <ImageIcon className="w-3.5 h-3.5 mr-1" />
          {imageSrc ? 'Ready for scan' : 'No image chosen'}
        </span>

        <Button
          onClick={handleContinue}
          disabled={!imageSrc}
          variant="primary"
          size="md"
          className="px-6 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          <span>Continue to Scan</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

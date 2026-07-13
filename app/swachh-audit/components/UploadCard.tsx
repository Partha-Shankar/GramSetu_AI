'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface UploadCardProps {
  onContinue: (imageSrc: string) => void;
}

export function UploadCard({ onContinue }: UploadCardProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress image using Canvas to avoid localStorage storage limits
  const processAndResizeImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image. Please upload a JPEG or PNG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to jpeg with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImageSrc(compressedDataUrl);
          setError(null);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndResizeImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndResizeImage(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageSrc(null);
    setError(null);
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
          Select or drop a photo of a waste pile, stagnant water, or sewer
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {error && (
          <div className="mb-4 flex items-start space-x-2 text-xs bg-red-50 text-red-700 p-3 rounded-md border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/35">
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
              Drag & drop file here or <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
              Supports JPEG, PNG up to 10MB
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

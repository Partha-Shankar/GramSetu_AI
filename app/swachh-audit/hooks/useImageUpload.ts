'use client';

import { useState, useCallback } from 'react';
import { useAudit } from '../context/AuditContext';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;

export function useImageUpload() {
  const { setCapturedImage, capturedImage, reset } = useAudit();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processAndResizeImage = useCallback((file: File) => {
    setError(null);

    // Validate format
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('Unsupported file format. Please upload JPEG, PNG, or WEBP.');
      return;
    }

    // Validate file size (10 MB limit)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setError('Invalid image file. The file might be corrupted.');
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        // Perform canvas-based resizing/compression if image exceeds max dimensions
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
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
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to jpeg with 0.8 quality for standard compression
          try {
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(compressedDataUrl);
            setError(null);
          } catch (err) {
            console.error('Failed to compress image:', err);
            // Fallback to original read result if compression fails
            setCapturedImage(e.target?.result as string);
          }
        } else {
          setCapturedImage(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [setCapturedImage]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndResizeImage(e.dataTransfer.files[0]);
    }
  }, [processAndResizeImage]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndResizeImage(e.target.files[0]);
    }
  }, [processAndResizeImage]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement> | ClipboardEvent) => {
    const clipboardData = (e as React.ClipboardEvent).clipboardData || (e as ClipboardEvent).clipboardData;
    const items = clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processAndResizeImage(file);
            break;
          }
        }
      }
    }
  }, [processAndResizeImage]);

  const removeImage = useCallback(() => {
    reset();
    setError(null);
  }, [reset]);

  return {
    imageSrc: capturedImage,
    dragActive,
    error,
    setError,
    processAndResizeImage,
    handleDrag,
    handleDrop,
    handleFileChange,
    handlePaste,
    removeImage,
  };
}

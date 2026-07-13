'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera as CameraIcon, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

type FacingMode = 'environment' | 'user';

export function CameraCaptureModal({ onCapture, onClose }: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 'environment' = rear camera (phones), most useful for scanning documents.
  // Falls back gracefully to whatever camera is available (e.g. laptop webcam).
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(
    async (mode: FacingMode) => {
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch {
        setError(
          'Could not access the camera. Check browser permissions, or use "Upload Image" instead.'
        );
      }
    },
    [stopStream]
  );

  useEffect(() => {
    // Subscribing to an external system (the camera) — the resulting
    // setError call happens after the async getUserMedia call resolves,
    // not synchronously during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startStream(facingMode);
    return () => stopStream();
  }, [facingMode, startStream, stopStream]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        stopStream();
        onCapture(file);
      },
      'image/jpeg',
      0.92
    );
  }

  function handleClose() {
    stopStream();
    onClose();
  }

  function toggleFacing() {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-100 p-4 dark:border-neutral-900">
          <h3 className="text-sm font-semibold">Capture Document</h3>
          <button
            onClick={handleClose}
            aria-label="Close camera"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[3/4] bg-black">
          {error ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-neutral-300">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-4 p-4">
          <Button variant="outline" size="sm" onClick={toggleFacing} disabled={!!error}>
            <RotateCcw className="mr-2 w-4 h-4" />
            Flip Camera
          </Button>
          <Button variant="primary" size="md" onClick={handleCapture} disabled={!!error}>
            <CameraIcon className="mr-2 w-4 h-4" />
            Capture
          </Button>
        </div>
      </div>
    </div>
  );
}
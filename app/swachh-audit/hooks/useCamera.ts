'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useAudit } from '../context/AuditContext';

export function useCamera() {
  const { setCapturedImage, capturedImage, reset } = useAudit();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    setLoading(true);
    setError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video metadata to load before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.error('Error playing video stream:', err);
          });
        };
      }

      setPermissionState('granted');
      setCameraActive(true);
      setLoading(false);
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      
      const isPermissionDenied = 
        err instanceof DOMException && 
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');

      setPermissionState(isPermissionDenied ? 'denied' : 'prompt');
      setError(
        isPermissionDenied 
          ? 'Camera access denied. Please enable camera permissions in settings.' 
          : 'Unable to start camera. Device might be in use or unavailable.'
      );
      setCameraActive(false);
      setLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera(facingMode);
    }, 0);
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [facingMode, startCamera, stopCamera]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const captureImage = useCallback((): string | null => {
    if (cameraActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Use actual video dimensions if available, fallback to defaults
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw flipped image if using 'user' (front) camera for mirror effect
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Output as high-quality JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
        return dataUrl;
      }
    }
    return null;
  }, [cameraActive, facingMode, setCapturedImage, stopCamera]);

  const retakeImage = useCallback(() => {
    reset();
    startCamera(facingMode);
  }, [reset, startCamera, facingMode]);

  return {
    videoRef,
    facingMode,
    permissionState,
    cameraActive,
    loading,
    error,
    capturedImage,
    startCamera: () => startCamera(facingMode),
    stopCamera,
    toggleFacingMode,
    captureImage,
    retakeImage,
  };
}

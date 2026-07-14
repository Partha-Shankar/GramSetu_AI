'use client';

import React, { useState } from 'react';
import { Camera, RefreshCw, Upload, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useCamera } from '../hooks/useCamera';

interface CameraCardProps {
  onCapture: (imageSrc: string) => void;
}

export function CameraCard({ onCapture }: CameraCardProps) {
  const {
    videoRef,
    facingMode,
    permissionState,
    cameraActive,
    loading,
    error,
    toggleFacingMode,
    captureImage,
  } = useCamera();

  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  const handleCapture = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    const dataUrl = captureImage();
    if (dataUrl) {
      onCapture(dataUrl);
    } else {
      // Fallback: Capture a premium mock street scenery image if capture fails or camera is offline
      const mockImages = [
        'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800',
      ];
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      onCapture(randomImage);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-md">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Camera Stream</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Align waste or drainage in frame to scan
            </CardDescription>
          </div>
          {cameraActive && (
            <span className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Feed</span>
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 relative bg-neutral-950 flex items-center justify-center aspect-video sm:max-h-[420px] overflow-hidden">
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-20 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <span className="text-xs">Starting camera feed...</span>
          </div>
        )}

        {/* Live Video */}
        {cameraActive && permissionState === 'granted' && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* Mock View when real camera is inactive and loading is done */}
        {!cameraActive && !loading && permissionState !== 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-300 bg-neutral-900 z-10">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            <div className="relative z-10 space-y-4">
              <div className="mx-auto w-12 h-12 bg-neutral-800/80 rounded-full flex items-center justify-center border border-neutral-700">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">On-Device Camera Mock Simulator</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {error || 'A real camera was not found or could not initialize. Taking a photo will simulate a high-quality waste audit scan.'}
                </p>
              </div>
              <div className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase bg-blue-950/80 border border-blue-900 text-blue-400 px-2 py-0.5 rounded-sm">
                <Eye className="w-3 h-3" />
                <span>Simulation Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Permission Denied State */}
        {permissionState === 'denied' && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-300 bg-neutral-900 z-20">
            <div className="mx-auto w-12 h-12 bg-red-950/50 rounded-full flex items-center justify-center border border-red-900 mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-200">Camera Access Denied</h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Please grant camera permissions in your browser settings to perform active scans. Alternatively, upload an image from your device.
            </p>
            <div className="mt-4">
              <Link href="/swachh-audit/upload">
                <Button variant="outline" size="sm" className="text-xs bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white cursor-pointer">
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  Upload Image Instead
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Scanner Radar Overlay effect */}
        {cameraActive && !loading && (
          <div className="absolute inset-0 border-2 border-blue-500/20 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
            {/* Horizontal sweep animation */}
            <div className="w-full h-0.5 bg-blue-500/50 absolute top-0 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[bounce_3s_infinite_linear]" />
          </div>
        )}

        {/* Shutter flash overlay */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150 animate-out fade-out" />
        )}
      </CardContent>

      <CardFooter className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 p-4 flex items-center justify-between">
        <Link href="/swachh-audit/upload">
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-800 cursor-pointer">
            <Upload className="w-4 h-4 mr-1.5" />
            <span className="text-xs">Upload instead</span>
          </Button>
        </Link>

        {permissionState !== 'denied' && (
          <Button
            onClick={handleCapture}
            variant="primary"
            size="md"
            className="rounded-full shadow-md px-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Camera className="w-4 h-4 mr-1.5" />
            <span className="text-xs">Capture Photo</span>
          </Button>
        )}

        {cameraActive && permissionState === 'granted' ? (
          <Button
            onClick={toggleFacingMode}
            variant="outline"
            size="sm"
            className="text-neutral-600 hover:bg-neutral-100 border-neutral-200 cursor-pointer"
            title="Switch Camera"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        ) : (
          <div className="w-9" /> // spacer
        )}
      </CardFooter>
    </Card>
  );
}

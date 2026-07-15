'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SwachhAuditHeader } from '../components/SwachhAuditHeader';
import { useDetection } from '../hooks/useDetection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Terminal, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DetectionPage() {
  const router = useRouter();
  const {
    isProcessing,
    progress,
    logs,
    error,
    runDetection,
    setError,
    reset
  } = useDetection();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [villageName, setVillageName] = useState<string>('');
  const detectionStarted = useRef<boolean>(false);

  useEffect(() => {
    // 1. Fetch image from localStorage or context
    const stored = localStorage.getItem('swachh_audit_temp_image');
    if (!stored) {
      router.push('/swachh-audit');
      return;
    }

    const timer = setTimeout(() => {
      setImageSrc(stored);

      // Pick a random village for this audit scan
      const villages = ['Rajpur', 'Dhamori', 'Kalyanpur', 'Pipaldhar', 'Sonori', 'Malegaon'];
      const randomVillage = villages[Math.floor(Math.random() * villages.length)];
      setVillageName(randomVillage);

      // 2. Start detection exactly once
      if (!detectionStarted.current) {
        detectionStarted.current = true;
        
        runDetection(randomVillage).then((report) => {
          if (report) {
            // Wait slightly for progress animation to visual-complete, then route to results
            setTimeout(() => {
              router.push(`/swachh-audit/result?id=${report.id}`);
            }, 300);
          }
        });
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [router, runDetection]);

  const handleRetry = () => {
    if (imageSrc) {
      setError(null);
      detectionStarted.current = true;
      runDetection(villageName).then((report) => {
        if (report) {
          router.push(`/swachh-audit/result?id=${report.id}`);
        }
      });
    }
  };

  const handleCancel = () => {
    reset();
    router.push('/swachh-audit');
  };

  if (!imageSrc) return null;

  return (
    <div className="space-y-6">
      <SwachhAuditHeader />

      <div className="max-w-xl mx-auto space-y-6">
        {error ? (
          /* Error State Card (Part 14) */
          <Card className="border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10 shadow-lg overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/35 rounded-full flex items-center justify-center border border-red-200 dark:border-red-800">
                <AlertCircle className="w-6 h-6 text-red-650 dark:text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                  AI Pipeline Failed
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                  {error}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full justify-center mt-2">
                <Button
                  onClick={handleRetry}
                  variant="primary"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer px-5"
                >
                  Retry Inference
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="text-xs bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Normal Analyzing/Scanning State Card */
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center">
              {/* Title & Status */}
              <div className="flex items-center space-x-2.5 mb-6 text-blue-600 dark:text-blue-400">
                <Cpu className="w-5 h-5 animate-spin" />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Analyzing Image (On-Device AI)
                </h2>
              </div>

              {/* Scanning Image Container */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-neutral-950 mb-6 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Scanning..."
                  className="w-full h-full object-contain opacity-60"
                />
                {/* Green Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-[bounce_2s_infinite_linear]" />
                {/* Radar sweep radial */}
                <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none" />
              </div>

              {/* Progress Percentage */}
              <div className="w-full mb-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-neutral-500 dark:text-neutral-450 flex items-center">
                    Analyzing sanitation details...
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Terminal logs simulating ONNX runtime */}
              <div className="w-full bg-neutral-900 rounded-lg p-3 border border-neutral-800 font-mono text-[10px] text-neutral-350 space-y-1.5 min-h-[120px]">
                <div className="flex items-center space-x-1.5 text-neutral-450 border-b border-neutral-800 pb-1.5 mb-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Console Log (Local AI Engine)</span>
                </div>
                <div className="space-y-1">
                  {logs.map((log, index) => {
                    const isLast = index === logs.length - 1;
                    return (
                      <div
                        key={index}
                        className={`flex items-start space-x-1.5 ${
                          isLast ? 'text-emerald-400 font-bold' : 'text-neutral-450'
                        }`}
                      >
                        <span className="shrink-0 select-none">
                          {isLast && isProcessing ? '>' : '•'}
                        </span>
                        <span>{log}</span>
                      </div>
                    );
                  })}
                  {logs.length === 0 && (
                    <div className="text-neutral-500 italic">Starting pipeline...</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

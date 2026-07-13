'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwachhAuditHeader } from '../components/SwachhAuditHeader';
import { auditService } from '../services/auditService';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Terminal, MapPin } from 'lucide-react';

const LOGS = [
  'Initializing local CPU/WebGL inference session...',
  'Loading YOLOv8-nano weights from device cache (14.2 MB)...',
  'Pre-processing capture frame (scaling to 640x640 tensor)...',
  'Running forward-pass on on-device WebGL backend...',
  'Applying Non-Maximum Suppression (confidence threshold: 0.25)...',
  'Extracting bounding box coordinates & category tags...',
  'Finalizing local audit payload & calculating cleanliness indices...',
  'Syncing local storage logs... Done!',
];

export default function DetectionPage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [villageName, setVillageName] = useState<string>('');

  useEffect(() => {
    // 1. Fetch image from localStorage
    const stored = localStorage.getItem('swachh_audit_temp_image');
    if (!stored) {
      router.push('/swachh-audit');
      return;
    }
    
    // Pick a random village for this audit
    const villages = ['Rajpur', 'Dhamori', 'Kalyanpur', 'Pipaldhar', 'Sonori', 'Malegaon'];
    const randomVillage = villages[Math.floor(Math.random() * villages.length)];

    // Wrap state setting in setTimeout to satisfy custom linting rules
    const initTimer = setTimeout(() => {
      setImageSrc(stored);
      setVillageName(randomVillage);
    }, 0);

    // 2. Animate the progress bar and log lines
    const duration = 2500; // 2.5 seconds total
    const intervalTime = 50;
    const stepCount = duration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / stepCount) * 100), 100);
      setProgress(currentProgress);

      // Distribute log lines across progress
      const nextLogIndex = Math.min(
        Math.floor((currentProgress / 100) * LOGS.length),
        LOGS.length - 1
      );
      setLogIndex(nextLogIndex);

      if (currentStep >= stepCount) {
        clearInterval(progressInterval);
      }
    }, intervalTime);

    // 3. Trigger mock service and redirect once done
    let redirectTimeout: NodeJS.Timeout;
    
    auditService.runMockDetection(stored, randomVillage).then((report) => {
      // Clear temp image
      localStorage.removeItem('swachh_audit_temp_image');
      
      // Wait for progress animation to finish before redirecting
      redirectTimeout = setTimeout(() => {
        router.push(`/swachh-audit/result?id=${report.id}`);
      }, 500);
    });

    return () => {
      clearTimeout(initTimer);
      clearInterval(progressInterval);
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [router]);

  if (!imageSrc) return null;

  return (
    <div className="space-y-6">
      <SwachhAuditHeader />

      <div className="max-w-xl mx-auto space-y-6">
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
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-350 dark:border-neutral-800 bg-neutral-950 mb-6 flex items-center justify-center">
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
                  <MapPin className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                  Auditing Location: {villageName}
                </span>
                <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Terminal logs simulating ONNX runtime */}
            <div className="w-full bg-neutral-900 rounded-lg p-3 border border-neutral-800 font-mono text-[10px] text-neutral-350 space-y-1.5 min-h-[96px]">
              <div className="flex items-center space-x-1.5 text-neutral-450 border-b border-neutral-800 pb-1.5 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Console Log (Local AI Engine)</span>
              </div>
              <div className="space-y-1">
                {LOGS.slice(0, logIndex + 1).map((log, index) => {
                  const isCurrent = index === logIndex;
                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-1.5 ${
                        isCurrent
                          ? 'text-emerald-400 font-bold'
                          : 'text-neutral-450'
                      }`}
                    >
                      <span className="shrink-0 select-none">
                        {isCurrent ? '>' : '•'}
                      </span>
                      <span>{log}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

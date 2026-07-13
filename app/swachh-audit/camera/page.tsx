'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SwachhAuditHeader } from '../components/SwachhAuditHeader';
import { CameraCard } from '../components/CameraCard';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CameraPage() {
  const router = useRouter();

  const handleCapture = (imageSrc: string) => {
    // Save image to localStorage for transient state passing
    try {
      localStorage.setItem('swachh_audit_temp_image', imageSrc);
      // Navigate to detection screen
      router.push('/swachh-audit/detection');
    } catch (e) {
      console.error('Failed to save temp captured image:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <SwachhAuditHeader />

      <div className="flex items-center space-x-2">
        <Link href="/swachh-audit">
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-800 cursor-pointer">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <CameraCard onCapture={handleCapture} />
      </div>
    </div>
  );
}

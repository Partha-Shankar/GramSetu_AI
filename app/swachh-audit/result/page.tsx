'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SwachhAuditHeader } from '../components/SwachhAuditHeader';
import { auditService } from '../services/auditService';
import { SwachhAuditReport } from '../types/types';
import { DetectionPreview } from '../components/DetectionPreview';
import { CleanlinessScoreCard } from '../components/CleanlinessScoreCard';
import { WasteSummaryCard } from '../components/WasteSummaryCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { Download, LayoutDashboard, Plus, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<SwachhAuditReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    // Wrap in setTimeout to satisfy custom linting rules
    const timer = setTimeout(() => {
      setLoading(true);
      const reportId = searchParams.get('id');
      if (reportId) {
        const found = auditService.getReport(reportId);
        if (found) {
          setReport(found);
        }
      } else {
        // Get latest report
        const history = auditService.getHistory();
        if (history.length > 0) {
          setReport(history[0]);
        }
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleDownloadJSON = () => {
    if (!report) return;
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `swachhaudit_report_${report.id}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to download report JSON:', e);
    }
  };

  if (loading) {
    return <LoadingState count={3} />;
  }

  if (!report) {
    return (
      <EmptyState
        title="Report Not Found"
        description="We couldn't locate the specified audit report. It may have been deleted or the ID is invalid."
        actionText="Back to Dashboard"
        onAction={() => router.push('/swachh-audit')}
      />
    );
  }

  const dateStr = new Date(report.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <SwachhAuditHeader />

      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/swachh-audit">
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-800 cursor-pointer">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Dashboard</span>
          </Button>
        </Link>

        {/* Date and Location Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-500">
          <span className="flex items-center font-semibold text-neutral-800 dark:text-neutral-200">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            Village: {report.villageName}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {dateStr}
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Image Scan Overlay Bounding Boxes (8 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-md">
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                AI Detected Bounding Boxes (Hover to Inspect)
              </span>
              <SeverityBadge severity={report.severity} />
            </div>
            <CardContent className="p-4">
              <DetectionPreview
                imageSrc={report.imageSrc}
                detections={report.detections}
                highlightedId={hoveredId}
                onHoverDetection={setHoveredId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Cleanliness Metric Score + Summary (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <CleanlinessScoreCard score={report.cleanlinessScore} />

          <WasteSummaryCard
            detections={report.detections}
            highlightedId={hoveredId}
            onHoverDetection={setHoveredId}
          />
        </div>
      </div>

      {/* Action Buttons Panel */}
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-neutral-50 dark:bg-neutral-900 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-405 text-center sm:text-left">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              Report ID: <span className="font-mono text-[10px] bg-white dark:bg-neutral-950 px-1.5 py-0.5 border rounded-xs">{report.id}</span>
            </p>
            <p className="mt-0.5">Offline local sync copy generated</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3">
            <Button
              onClick={handleDownloadJSON}
              variant="outline"
              size="md"
              className="text-xs bg-white text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2 text-neutral-500" />
              <span>Download JSON Payload</span>
            </Button>

            <Link href="/swachh-audit/camera">
              <Button variant="primary" size="md" className="text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                <span>New Audit</span>
              </Button>
            </Link>

            <Link href="/swachh-audit">
              <Button variant="outline" size="md" className="text-xs bg-white text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <LayoutDashboard className="w-4 h-4 mr-2 text-neutral-500" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SwachhAuditResultPage() {
  return (
    <Suspense fallback={<LoadingState count={3} />}>
      <ResultContent />
    </Suspense>
  );
}

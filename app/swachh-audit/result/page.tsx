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
import { Download, FileText, LayoutDashboard, Plus, ChevronLeft, Calendar } from 'lucide-react';
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

  const handleDownloadPDF = () => {
    if (!report) return;
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download the PDF report.');
        return;
      }

      const dateStrPrint = new Date(report.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const recommendationItems = report.recommendations.map(r => `<li>${r}</li>`).join('');
      const detectionsCount = report.detections.length;
      
      const detectionsList = report.detections.map((det, index) => {
        let binInfo = '';
        if (det.category === 'dry') {
          binInfo = ' - <strong style="color: #2563eb;">Discard in BLUE Dustbin (Dry Waste)</strong>';
        } else if (det.category === 'wet') {
          binInfo = ' - <strong style="color: #16a34a;">Discard in GREEN Dustbin (Wet Waste)</strong>';
        } else if (det.category === 'hazardous') {
          binInfo = ' - <strong style="color: #dc2626;">Discard in RED Dustbin (Hazardous/E-waste)</strong>';
        } else if (det.category === 'sanitation') {
          binInfo = ' - <strong style="color: #7c3aed;">Notify Gram Panchayat PDO</strong>';
        }
        return `
          <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
            <strong>#${index + 1} ${det.label}</strong> (${Math.round(det.confidence * 100)}% Confidence)${binInfo}
          </div>
        `;
      }).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>GramSetu AI - Sanitation Audit Report</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1f2937;
              line-height: 1.5;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #2563eb;
            }
            .title {
              font-size: 20px;
              font-weight: 700;
              margin-top: 8px;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #6b7280;
              margin-top: 12px;
            }
            .score-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            .score-box {
              text-align: center;
            }
            .score-num {
              font-size: 32px;
              font-weight: 800;
              color: #1e3a8a;
            }
            .severity-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              background-color: ${report.severity === 'critical' ? '#fee2e2' : report.severity === 'high' ? '#fef3c7' : '#d1fae5'};
              color: ${report.severity === 'critical' ? '#991b1b' : report.severity === 'high' ? '#92400e' : '#065f46'};
            }
            h3 {
              font-size: 15px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #4b5563;
              margin-top: 24px;
              margin-bottom: 12px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 6px;
            }
            ul {
              padding-left: 20px;
              margin: 0;
            }
            li {
              font-size: 13px;
              margin-bottom: 8px;
              font-weight: 500;
            }
            .footer {
              margin-top: 48px;
              border-top: 1px solid #e5e7eb;
              padding-top: 16px;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">GramSetu AI</div>
            <div class="title">Sanitation Scan Audit Report</div>
            <div class="meta">
              <span><strong>Report ID:</strong> ${report.id}</span>
              <span><strong>Date & Time:</strong> ${dateStrPrint}</span>
            </div>
          </div>

          <div class="score-section">
            <div class="score-box">
              <div class="score-num">${report.cleanlinessScore}%</div>
              <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #4b5563;">Cleanliness Score</div>
            </div>
            <div>
              <span class="severity-badge">${report.severity} Severity</span>
            </div>
          </div>

          <h3>Audit Summary</h3>
          <p style="font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 24px;">
            ${report.notes || 'No description provided.'}
          </p>

          <h3>Detected Waste Details</h3>
          <div style="margin-bottom: 24px;">
            ${detectionsCount === 0 ? '<div style="font-size: 13px; color: #6b7280;">No waste objects detected. Site is clear.</div>' : detectionsList}
          </div>

          <h3>Required Cleaning Actions</h3>
          <ul>
            ${recommendationItems}
          </ul>

          <div class="footer">
            Generated locally by GramSetu AI Sanitation Monitoring System.
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      console.error('Failed to generate PDF:', e);
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

        {/* Date Header (Location removed) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-500">
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
            recommendations={report.recommendations}
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

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="md"
              className="text-xs bg-white text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-neutral-500" />
              <span>Download PDF Report</span>
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

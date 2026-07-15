import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { SavedReport } from '../types/jaldrishti.types';

interface ReportHistoryListProps {
  reports: SavedReport[];
  onSelectReport: (report: SavedReport) => void;
}

const STATUS_CONFIG = {
  safe: { icon: CheckCircle2, color: 'text-green-600', label: 'Safe' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', label: 'Warning' },
  unsafe: { icon: XCircle, color: 'text-red-600', label: 'Unsafe' },
};

export function ReportHistoryList({ reports, onSelectReport }: ReportHistoryListProps) {
  if (reports.length === 0) {
    return (
      <p className="text-sm text-neutral-400 text-center py-8">
        No past reports yet. Scan a strip to see it here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => {
        const config = STATUS_CONFIG[report.overallStatus];
        const Icon = config.icon;
        return (
          <Card
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:border-neutral-300 transition-colors"
          >
            <Icon className={cn('w-5 h-5 shrink-0', config.color)} />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{config.label}</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </Card>
        );
      })}
    </div>
  );
}
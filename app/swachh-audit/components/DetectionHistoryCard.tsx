'use client';

import React from 'react';
import { SwachhAuditReport } from '../types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import Link from 'next/link';

interface DetectionHistoryCardProps {
  report: SwachhAuditReport;
  onDelete: (id: string) => void;
}

export function DetectionHistoryCard({ report, onDelete }: DetectionHistoryCardProps) {
  // Format timestamp
  const dateStr = new Date(report.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0 flex flex-col sm:flex-row h-full">
        {/* Left: Thumbnail Image */}
        <div className="relative w-full sm:w-44 h-32 sm:h-auto shrink-0 bg-neutral-900 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.imageSrc}
            alt={`Audit at ${report.villageName}`}
            className="w-full h-full object-cover"
          />
          {/* Circular Cleanliness Score overlay on thumbnail */}
          <div className="absolute top-2 left-2 bg-neutral-900/85 backdrop-blur-xs text-white rounded-md px-2 py-0.5 text-[10px] font-bold border border-neutral-700/50">
            Score: {report.cleanlinessScore}
          </div>
        </div>

        {/* Right: Info Area */}
        <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
          {/* Metadata */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-semibold text-neutral-800 dark:text-neutral-200 mr-2">
                <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                {report.villageName}
              </span>
              <SeverityBadge severity={report.severity} />
            </div>

            <div className="flex items-center text-[10px] text-neutral-400 dark:text-neutral-505">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{dateStr}</span>
            </div>
          </div>

          {/* Description & count */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {report.notes || 'No description provided.'}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-900">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Objects: <span className="text-neutral-700 dark:text-neutral-300 font-extrabold">{report.objectCount}</span>
            </span>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onDelete(report.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 h-8 w-8 cursor-pointer"
                title="Delete Report"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Link href={`/swachh-audit/result?id=${report.id}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function GramLipiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="GramLipi"
        description="OCR scanning and regional language translation."
      />

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Document Digitisation</CardTitle>
          <CardDescription className="text-xs">
            Convert records and translate texts locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border border-dashed border-neutral-200 rounded-md bg-neutral-50/50">
          <span className="text-sm text-neutral-400">
            Feature coming soon.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

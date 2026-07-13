import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function JalDrishtiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="JalDrishti"
        description="Water resource monitoring and tracking."
      />

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Water Analysis</CardTitle>
          <CardDescription className="text-xs">
            Analyze turbidity, pH levels, and tracking.
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

'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { ModuleCard } from '@/components/cards/module-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { MODULES_METADATA } from '@/constants/modules';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="SaaS platform for offline-first, on-device applications."
      />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Available Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES_METADATA.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Overview</CardTitle>
          <CardDescription className="text-xs">
            Summary of local system activities and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center border border-dashed border-neutral-200 rounded-md bg-neutral-50/50">
          <span className="text-sm text-neutral-400">
            Select a feature from above to get started.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

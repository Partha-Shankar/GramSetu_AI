'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your account preferences."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-neutral-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profile Settings</CardTitle>
            <CardDescription className="text-xs">
              Manage your personal credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center border border-dashed border-neutral-200 rounded-md bg-neutral-50/50">
            <span className="text-sm text-neutral-400">Settings coming soon.</span>
          </CardContent>
        </Card>

        <Card className="border-neutral-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Preferences</CardTitle>
            <CardDescription className="text-xs">
              Manage language preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center border border-dashed border-neutral-200 rounded-md bg-neutral-50/50">
            <span className="text-sm text-neutral-400">Preferences coming soon.</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

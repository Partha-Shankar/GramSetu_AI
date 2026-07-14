'use client';

import React from 'react';
import { AuditProvider } from './context/AuditContext';

export default function SwachhAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuditProvider>{children}</AuditProvider>;
}

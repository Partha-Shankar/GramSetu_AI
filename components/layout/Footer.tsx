'use client';

import React from 'react';
import { Container } from '../common/container';

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-3 shrink-0 text-xs">
      <Container className="flex items-center justify-between gap-2 text-neutral-500">
        <div>
          <span>&copy; {new Date().getFullYear()} GramSetu AI. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
